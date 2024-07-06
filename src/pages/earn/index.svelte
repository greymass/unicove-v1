<script lang="ts">
    import type {Readable, Writable} from 'svelte/store'
    import {derived, writable, get} from 'svelte/store'
    import {Asset} from 'anchor-link'

    import {currentAccount} from '~/store'
    import {activeBlockchain, activeSession} from '~/store'
    import type {Token} from '~/stores/tokens'
    import {systemTokenKey, tokens} from '~/stores/tokens'
    import {balances} from '~/stores/balances'
    import {REXDeposit, REXWithdraw, REXBUYREX, REXSELLREX} from '~/abi-types'
    import type {FormTransaction} from '~/ui-types'
    import {rexIsAvailable} from '~/lib/rex'

    import Page from '~/components/layout/page.svelte'
    import TransactionForm from '~/components/elements/form/transaction.svelte'

    import {stateREX} from '~/pages/resources/resources'
    import {Step, REXInfo} from '~/pages/earn/types'
    import REXBootstrap from '~/pages/earn/step/bootstrap.svelte'
    import REXError from '~/pages/earn/step/error.svelte'
    import REXOverview from '~/pages/earn/step/overview.svelte'
    import REXStake from '~/pages/earn/step/stake.svelte'
    import REXUnstake from '~/pages/earn/step/unstake.svelte'
    import REXClaim from '~/pages/earn/step/claim.svelte'
    import REXConfirm from '~/pages/earn/step/confirm.svelte'

    let selectedAmount: string
    let selectedAction: string
    let onConfirmBack: () => void
    let error: string = ''

    $: {
        if (!rexIsAvailable($activeBlockchain)) {
            window.location.href = window.origin
        }
    }
    const availableSystemTokens: Readable<Asset> = derived(
        [balances, currentAccount, systemTokenKey, activeBlockchain],
        ([$balances, $currentAccount, $systemTokenKey, $activeBlockchain]) => {
            let amount = 0
            if ($currentAccount) {
                $balances
                    .filter(
                        (record) =>
                            record.account.equals($currentAccount.account_name) &&
                            record.tokenKey === $systemTokenKey
                    )
                    .map((record) => {
                        amount += record.quantity.value
                    })
            }
            return Asset.from(amount, $activeBlockchain.coreTokenSymbol)
        }
    )

    const systemToken: Readable<Token | undefined> = derived(
        [systemTokenKey, tokens],
        ([$systemTokenKey, $tokens]) => {
            let token = $tokens.find((t: Token) => t.key === $systemTokenKey)
            return token
        }
    )

    const rexInfo: Readable<REXInfo> = derived(
        [currentAccount, stateREX, systemToken],
        ([$currentAccount, $stateREX, $systemToken]) => {
            let defaultZero = Asset.from(0, $systemToken!.symbol)
            let total = defaultZero
            let savings = defaultZero
            let matured = defaultZero
            let rexPrice = 0
            const fiveYearsFromNow = new Date().getTime() + 1000 * 60 * 60 * 24 * 365 * 5

            if ($currentAccount && $currentAccount.rex_info && $stateREX && $stateREX.value) {
                if ($stateREX.value === 0.0001) {
                    rexPrice = $stateREX.total_lendable.value / $stateREX.total_rex.value
                } else {
                    rexPrice = $stateREX.value
                }

                total = Asset.from(
                    $currentAccount.rex_info.rex_balance.value * rexPrice,
                    $systemToken!.symbol
                )
                matured = Asset.from(
                    Asset.fromUnits(
                        $currentAccount.rex_info.matured_rex,
                        $currentAccount.rex_info.rex_balance.symbol
                    ).value * rexPrice,
                    $systemToken!.symbol
                )

                let savingsBucket = $currentAccount.rex_info.rex_maturities.find(
                    (maturity) => +new Date(maturity.first!.toString()) > +fiveYearsFromNow
                )
                if (savingsBucket) {
                    savings = Asset.from(
                        Asset.fromUnits(
                            savingsBucket.second!,
                            $currentAccount.rex_info.rex_balance.symbol
                        ).value * rexPrice,
                        $systemToken!.symbol
                    )
                }
            }
            return {total, savings, matured, price: rexPrice}
        }
    )

    const rexToken: Readable<Token> = derived(
        [systemToken, rexInfo],
        ([$systemToken, $rexInfo]) => {
            let tokenValue = $systemToken!
            let newToken = {...tokenValue}
            newToken.balance = $rexInfo.total
            return newToken
        }
    )

    const defaultStep: Readable<Step> = derived(rexInfo, ($rexInfo) => {
        let result: Step = Step.Bootstrap
        if ($rexInfo && $rexInfo.total.value != 0) {
            result = Step.Overview
        }
        return result
    })

    const initialStep: Step = Step.Bootstrap
    const step: Writable<Step> = writable(initialStep, () => {
        const unsubscribeStep = defaultStep.subscribe((s) => {
            let current: Step = get(step)
            if (current === Step.Bootstrap || current == Step.Overview) {
                if (current != s) {
                    step.set(s)
                }
            }
        })
        return () => {
            unsubscribeStep()
        }
    })

    function switchStep(s: Step) {
        step.set(s)
    }

    function toStakeConfirm(fromStep: Step) {
        if (fromStep === Step.Stake || fromStep === Step.Bootstrap) {
            selectedAction = 'Stake'
        } else if (fromStep === Step.Claim) {
            selectedAction = 'Claim'
        } else {
            selectedAction = 'Unstake'
        }
        onConfirmBack = () => {
            switchStep(fromStep)
        }
        switchStep(Step.Confirm)
    }

    function getActionData() {
        if (selectedAction === 'Stake') {
            return getStakeAction()
        } else if (selectedAction === 'Unstake') {
            return getUnstakeAction()
        } else if (selectedAction === 'Claim') {
            return getClaimAction()
        } else {
            throw new Error('Unknown action')
        }
    }

    function getStakeAction() {
        return [
            {
                authorization: [$activeSession!.auth],
                account: 'eosio',
                name: 'deposit',
                data: REXDeposit.from({
                    owner: $activeSession!.auth.actor,
                    amount: Asset.from(Number(selectedAmount), $systemToken!.symbol),
                }),
            },
            {
                authorization: [$activeSession!.auth],
                account: 'eosio',
                name: 'buyrex',
                data: REXBUYREX.from({
                    from: $activeSession!.auth.actor,
                    amount: Asset.from(Number(selectedAmount), $systemToken!.symbol),
                }),
            },
        ]
    }

    function getUnstakeAction() {
        let rexNumber = Number(selectedAmount) / $rexInfo.price
        let rexAsset = Asset.from(rexNumber, $currentAccount!.rex_info!.rex_balance.symbol)
        return [
            {
                authorization: [$activeSession!.auth],
                account: 'eosio',
                name: 'mvfrsavings',
                data: REXWithdraw.from({
                    owner: $activeSession!.auth.actor,
                    amount: rexAsset,
                }),
            },
        ]
    }

    function getClaimAction() {
        let rexNumber = Number(selectedAmount) / $rexInfo.price
        let rexAsset = Asset.from(rexNumber, $currentAccount!.rex_info!.rex_balance.symbol)
        let finalAmount = Asset.from(rexAsset.value * $rexInfo.price, $systemToken!.symbol)
        return [
            {
                authorization: [$activeSession!.auth],
                account: 'eosio',
                name: 'sellrex',
                data: REXSELLREX.from({
                    from: $activeSession!.auth.actor,
                    rex: rexAsset,
                }),
            },
            {
                authorization: [$activeSession!.auth],
                account: 'eosio',
                name: 'withdraw',
                data: REXWithdraw.from({
                    owner: $activeSession!.auth.actor,
                    amount: finalAmount,
                }),
            },
        ]
    }

    // Create a derived store of the rex field we expect to be modified
    export const rexField = derived([currentAccount], ([$currentAccount]) => {
        if ($currentAccount && $currentAccount.rex_info && $currentAccount.rex_info.rex_balance) {
            return $currentAccount.rex_info.rex_balance
        }
        return Asset.from(0, $systemToken!.symbol)
    })

    async function handleConfirm(context: FormTransaction) {
        const actions = getActionData()
        try {
            const result = await $activeSession!.transact({
                actions,
            })
            // If the context exists and this is part of a FormTransaction
            if (context) {
                // Pass the transaction ID to the parent
                const txid = String(result.transaction.id)
                context.setTransaction(txid)
                // Await an update on the field expected for this transaction
                context.awaitAccountUpdate(rexField)
            }
        } catch (e) {
            console.warn('Error during transact', e)
            if (context) {
                let msg = String(e)
                if (e.details && e.details.length > 0 && e.details[0].message) {
                    msg = e.details[0].message
                }
                context.setTransactionError(msg)
            }
        }
    }

    function resetCallback() {
        step.set(get(defaultStep))
    }

    function retryCallback() {
        step.set(Step.Confirm)
    }
</script>

<style type="scss">
</style>

<Page divider={$step === Step.Bootstrap || $step === Step.Overview}>
    <TransactionForm {resetCallback} {retryCallback}>
        {#if $step === Step.Error}
            <REXError {error} handleBack={() => switchStep($defaultStep)} />
        {:else if $step === Step.Bootstrap}
            <REXBootstrap
                bind:amount={selectedAmount}
                availableTokens={$availableSystemTokens}
                nextStep={() => toStakeConfirm(Step.Bootstrap)}
            />
        {:else if $step === Step.Overview}
            <REXOverview
                availableTokens={$availableSystemTokens}
                rexInfo={$rexInfo}
                toStake={() => switchStep(Step.Stake)}
                toUnstake={() => switchStep(Step.Unstake)}
                toClaim={() => switchStep(Step.Claim)}
            />
        {:else if $step === Step.Stake}
            <REXStake
                bind:amount={selectedAmount}
                rexInfo={$rexInfo}
                token={$systemToken}
                availableTokens={$availableSystemTokens}
                nextStep={() => toStakeConfirm(Step.Stake)}
                handleBack={() => switchStep($defaultStep)}
            />
        {:else if $step === Step.Unstake}
            <REXUnstake
                bind:amount={selectedAmount}
                rexInfo={$rexInfo}
                token={$rexToken}
                availableTokens={$rexInfo.savings}
                nextStep={() => toStakeConfirm(Step.Unstake)}
                handleBack={() => switchStep($defaultStep)}
            />
        {:else if $step === Step.Claim}
            <REXClaim
                bind:amount={selectedAmount}
                rexInfo={$rexInfo}
                token={$rexToken}
                availableTokens={$rexInfo.matured}
                nextStep={() => toStakeConfirm(Step.Claim)}
                handleBack={() => switchStep($defaultStep)}
            />
        {:else if $step === Step.Confirm}
            <REXConfirm
                action={selectedAction}
                amount={Asset.from(Number(selectedAmount), $availableSystemTokens.symbol)}
                token={$systemToken}
                tokenKey={$systemTokenKey}
                {handleConfirm}
                handleBack={onConfirmBack}
            />
        {/if}
    </TransactionForm>
</Page>
