<script lang="ts">
    import type {Readable, Writable} from 'svelte/store'
    import {derived, writable, get} from 'svelte/store'
    import {AnyAction, Asset, Int128, Int64} from 'anchor-link'

    import {currentAccount} from '~/store'
    import {activeBlockchain, activeSession} from '~/store'
    import type {Token} from '~/stores/tokens'
    import {systemTokenKey, tokens} from '~/stores/tokens'
    import {balances} from '~/stores/balances'
    import {REXDeposit, MVFRSAVINGS, REXWithdraw, REXBUYREX, REXSELLREX} from '~/abi-types'
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
    import {onMount} from 'svelte'
    import {getClient} from '~/api-client'

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

    const convertEosToRex = (eos: number) => {
        const pool = $stateREX
        if (!$systemToken || !pool) {
            return Asset.from(0, $systemToken!.symbol)
        }

        const {total_lendable, total_rex} = pool
        const asset = Asset.from(eos, $systemToken!.symbol)
        const S1 = total_lendable.units.adding(asset.units)
        const R1 = Int128.from(S1).multiplying(total_rex.units).dividing(total_lendable.units)
        const result = R1.subtracting(total_rex.units)

        // Debugging using floats
        // const oS0 = parseFloat(String(pool.total_lendable).split(' ')[0])
        // const oS1 = oS0 + eos
        // const oR0 = parseFloat(String(pool.total_rex).split(' ')[0])
        // const oR1 = (oS1 * oR0) / oS0

        // console.table({
        //     S0: [String(S0), String(oS0)],
        //     R0: [String(R0), String(oR0)],
        //     R1: [String(R1), String(oR1)],
        //     S1: [String(S1), String((oS0 * oR1) / oR0)],
        //     result: [String(result), String(oR1 - oR0)],
        // })

        return Asset.fromUnits(result, $currentAccount!.rex_info!.rex_balance.symbol)
    }

    const convertRexToEos = (rex: number) => {
        const pool = $stateREX
        if (!$systemToken || !pool) {
            return Asset.from(0, $systemToken!.symbol)
        }

        const {total_lendable, total_rex} = pool
        const asset = Asset.from(rex, '4,REX')
        const R1 = total_rex.units.adding(asset.units)
        const S1 = Int128.from(R1).multiplying(total_lendable.units).dividing(total_rex.units)
        const result = S1.subtracting(total_lendable.units)

        // Debugging using floats
        // const oS0 = parseFloat(String(pool.total_lendable).split(' ')[0])
        // const oR0 = parseFloat(String(pool.total_rex).split(' ')[0])
        // const oR1 = oR0 + rex
        // const oS1 = (oS0 * oR1) / oR0
        // console.table({
        //     S0: [String(S0), String(oS0)],
        //     R0: [String(R0), String(oR0)],
        //     R1: [String(R1), String(oR1)],
        //     S1: [String(S1), String((oS0 * oR1) / oR0)],
        //     result: [String(result), String(oS1 - oS0)],
        // })

        return Asset.fromUnits(result, $systemToken!.symbol)
    }

    const rexEOSBalance: Writable<Asset> = writable(Asset.from(0, $systemToken!.symbol))
    onMount(async () => {
        const client = getClient($activeBlockchain.chainId)
        const unsubscribe = currentAccount.subscribe(async (account) => {
            if !$systemToken return
            const result = await client.v1.chain.get_table_rows({
                code: 'eosio',
                scope: 'eosio',
                table: 'rexfund',
                json: true,
                lower_bound: $currentAccount?.account_name,
                upper_bound: $currentAccount?.account_name,
            })
            if (result.rows.length > 0) {
                rexEOSBalance.set(Asset.from(result.rows[0].balance, $systemToken.symbol))
            } else {
                rexEOSBalance.set(Asset.from(0, $systemToken!.symbol))
            }
        })
        return () => {
            unsubscribe()
        }
    })

    const rexInfo: Readable<REXInfo> = derived(
        [currentAccount, stateREX, systemToken, rexEOSBalance],
        ([$currentAccount, $stateREX, $systemToken, $rexEOSBalance]) => {
            let defaultZero = Asset.from(0, $systemToken!.symbol)
            let total = defaultZero
            let savings = defaultZero
            let matured = defaultZero
            let apy = ''
            const fiveYearsFromNow = new Date().getTime() + 1000 * 60 * 60 * 24 * 365 * 5
            const now = new Date()

            if ($stateREX && $stateREX.value) {
                const annualReward = 31250000
                const totalStaked = Number($stateREX.total_lendable.value)
                apy = ((annualReward / totalStaked) * 100).toFixed(2)
                if ($currentAccount && $currentAccount.rex_info) {
                    total = convertRexToEos($currentAccount.rex_info.rex_balance.value)
                    if ($rexEOSBalance.value > 0) {
                        total = Asset.fromUnits(
                            total.units.adding($rexEOSBalance.units),
                            $systemToken!.symbol
                        )
                    }

                    const claimableBuckets = $currentAccount.rex_info.rex_maturities.filter(
                        (maturity) => +new Date(maturity.first!.toString()) < +now
                    )
                    let claimable = claimableBuckets.reduce(
                        (acc, r) => acc.adding(r.second!),
                        Int64.from(0)
                    )

                    matured = convertRexToEos(
                        Asset.fromUnits(
                            $currentAccount.rex_info.matured_rex.adding(claimable),
                            $currentAccount.rex_info.rex_balance.symbol
                        ).value
                    )

                    let savingsBucket = $currentAccount.rex_info.rex_maturities.find(
                        (maturity) => +new Date(maturity.first!.toString()) > +fiveYearsFromNow
                    )
                    if (savingsBucket) {
                        savings = convertRexToEos(
                            Asset.fromUnits(
                                savingsBucket.second!,
                                $currentAccount.rex_info.rex_balance.symbol
                            ).value
                        )
                    }
                }
            }

            return {apy, total, savings, matured}
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
        let rexAmount = convertEosToRex(Number(selectedAmount))
        return [
            {
                authorization: [$activeSession!.auth],
                account: 'eosio',
                name: 'mvfrsavings',
                data: MVFRSAVINGS.from({
                    owner: $activeSession!.auth.actor,
                    amount: rexAmount,
                }),
            },
        ]
    }

    function getClaimAction() {
        const actions: AnyAction[] = [
            {
                authorization: [$activeSession!.auth],
                account: 'eosio',
                name: 'withdraw',
                data: REXWithdraw.from({
                    owner: $activeSession!.auth.actor,
                    amount: Asset.from(Number(selectedAmount), $systemToken!.symbol),
                }),
            },
        ]

        if (Number($rexEOSBalance.value) < Number(selectedAmount)) {
            const difference = Number(selectedAmount) - Number($rexEOSBalance.value)
            const rexAmount = convertEosToRex(difference)
            actions.unshift({
                authorization: [$activeSession!.auth],
                account: 'eosio',
                name: 'sellrex',
                data: REXSELLREX.from({
                    from: $activeSession!.auth.actor,
                    rex: rexAmount,
                }),
            })
        }

        return actions
    }

    // Create a derived store of the rex field we expect to be modified
    export const rexField = derived([currentAccount], ([$currentAccount]) => {
        if ($currentAccount && $currentAccount.rex_info && $currentAccount.rex_info.rex_balance) {
            return $currentAccount.rex_info.rex_balance
        }
        return Asset.from(0, $systemToken!.symbol)
    })

    const claimableTokens = derived([rexInfo, rexEOSBalance], ([$rexInfo, $rexEOSBalance]) => {
        return Asset.fromUnits(
            $rexInfo.matured.units.adding($rexEOSBalance.units),
            $rexEOSBalance.symbol
        )
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
                rexInfo={$rexInfo}
                availableTokens={$availableSystemTokens}
                nextStep={() => toStakeConfirm(Step.Bootstrap)}
            />
        {:else if $step === Step.Overview}
            <REXOverview
                availableTokens={$availableSystemTokens}
                rexInfo={$rexInfo}
                rexEOSBalance={$rexEOSBalance}
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
                availableTokens={$claimableTokens}
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
