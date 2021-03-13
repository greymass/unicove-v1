<script lang="ts">
    import {Asset} from 'anchor-link'
    import {onMount} from 'svelte'
    import {writable} from 'svelte/store'
    import type {TinroRouteMeta} from 'tinro'

    import {Step} from './types'

    import {activeBlockchain, activeSession, currentAccount} from '~/store'
    import {txFee, syncTxFee, stopSyncTxFee, fetchTxFee} from './fio'

    import {FIOTransfer, Transfer} from '~/abi-types'

    import {transferData} from './transferData'
    import {tokenBalancesTicker} from '~/token-balances-ticker'
    import type {TokenBalance} from '~/token-balances-ticker'

    import TransactionNotificationSuccess from '~/components/elements/notification/transaction/success.svelte'

    import TransferBalance from './balance.svelte'
    import TransferSummary from './summary.svelte'
    import TransferRecipient from './recipient.svelte'
    import TransferAmount from './amount.svelte'
    import TransferConfirm from './confirm.svelte'

    import Modal from '~/components/elements/modal.svelte'
    import Page from '~/components/layout/page.svelte'

    export let meta: TinroRouteMeta | undefined = undefined

    let balance: Asset = Asset.fromUnits(0, $activeBlockchain.coreTokenSymbol)
    let successTx: string | undefined = undefined
    let displaySuccessTx = writable<boolean>(false)

    let previousChain: string | undefined = undefined
    let balanceValue: number | undefined = undefined
    let tokenBalance: TokenBalance | undefined = undefined
    let quantity: Asset | undefined = undefined
    let transferContract: string = 'eosio.token'

    onMount(() => {
        syncTxFee()

        return () => {
            // on unmount
            stopSyncTxFee()
        }
    })

    $: transferContract =
        (tokenBalance && tokenBalance.contract) || String($activeBlockchain.coreTokenContract)

    $: tokenBalances =
        $activeSession &&
        tokenBalancesTicker($activeSession, $activeBlockchain).catch((error) => {
            console.warn(`Unable to load price on ${$activeBlockchain.id}`, error)
        })

    $: {
        const chainToken =
            $activeBlockchain && $activeBlockchain.coreTokenSymbol.toString().split(',')[1]

        if (!meta || meta.params.token.toUpperCase() === chainToken) {
            balance =
                $currentAccount?.core_liquid_balance ||
                Asset.fromUnits(0, $activeBlockchain.coreTokenSymbol)
        } else if (tokenBalances && $tokenBalances) {
            tokenBalance = $tokenBalances[meta.params.token.toUpperCase()]

            if (tokenBalance && tokenBalance.balance) {
                balance = tokenBalance.balance
            }
        }
    }

    $: if ($activeBlockchain.id !== previousChain) {
        resetData()

        previousChain = $activeBlockchain.id
    }

    $: {
        balanceValue = (balance && balance.units.toNumber())!
    }

    $: {
        const parsed: number = parseFloat($transferData.amount || '')

        if (parsed) {
            quantity = Asset.fromFloat(
                parsed,
                (tokenBalance && tokenBalance.symbol) || $activeBlockchain.coreTokenSymbol
            )
        }
    }

    function resetData() {
        transferData.set({
            amount: '',
            toAccount: '',
            toAddress: '',
            memo: '',
            step: Step.Recipient,
        })

        quantity = undefined

        fetchTxFee()
    }

    function getActionData() {
        let data: Transfer | FIOTransfer = Transfer.from({
            from: $activeSession!.auth.actor,
            to: $transferData.toAccount,
            quantity,
            memo: $transferData.memo,
        })

        switch (String(transferContract)) {
            case 'fio.token': {
                data = FIOTransfer.from({
                    payee_public_key: $transferData.toAddress,
                    amount: quantity && quantity.units,
                    max_fee: $txFee!.units,
                    actor: $activeSession!.auth.actor,
                    tpid: 'tpid@greymass',
                })
            }
        }
        return data
    }

    async function handleTransfer() {
        $activeSession!
            .transact({
                action: {
                    authorization: [$activeSession!.auth],
                    account: transferContract,
                    name: $activeBlockchain.coreTokenTransfer,
                    data: getActionData(),
                },
            })
            .then((result) => {
                successTx = result?.payload?.tx
                $displaySuccessTx = true

                resetData()
            })
    }
</script>

<style>
    .container {
        max-width: 400px;
    }
</style>

<Page title="Transfer">
    <div class="container">
        <TransferBalance {balance} />

        {#if quantity && $txFee}
            <TransferSummary txFee={$txFee} {quantity} />
        {/if}

        <br />

        {#if $transferData.step === Step.Recipient}
            <TransferRecipient />
        {/if}

        {#if $transferData.step === Step.Amount}
            <TransferAmount availableBalance={balanceValue} />
        {/if}

        {#if $transferData.step === Step.Confirm}
            <TransferConfirm availableBalance={balanceValue} {quantity} {handleTransfer} />
        {/if}

        <Modal display={displaySuccessTx}>
            <TransactionNotificationSuccess activeBlockchain={$activeBlockchain} tx={successTx} />
        </Modal>
    </div>
</Page>
