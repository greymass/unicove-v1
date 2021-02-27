<script lang="ts">
    import type {LinkSession} from 'anchor-link'

    import {Asset, Name} from 'anchor-link'

    import {setContext} from 'svelte'

    import {activeBlockchain, activeSession} from '../store'

    import TransferBalance from './transfer/balance.svelte'
    import TransferSummary from './transfer/summary.svelte'
    import TransferRecipient from './transfer/recipient.svelte'
    import TransferAmount from './transfer/amount.svelte'
    import TransferConfirm from './transfer/confirm.svelte'

    import Page from '~/components/layout/page.svelte'

    import {loadFee, loadBalance} from '~/services/eosio/transfer/fio'

    let activeSessionObject: LinkSession

    export enum Step {
      Recipient,
      Amount,
      Confirm,
    }

    interface TransferData {
        memo?: string
        quantity?: Asset
        toAccount?: string
        toAddress?: string
        amount?: string
        displaySuccessTx?: string
        step: Step
    }

    let txFee: Asset = Asset.fromUnits(0, $activeBlockchain.coreTokenSymbol)
    let balance: Asset = Asset.fromUnits(0, $activeBlockchain.coreTokenSymbol)
    let balanceValue: number = 0

    let transferData = writable<TransferData>({ step: Step.Recipient })

    setContext('transferData', transferData)

    let step: Step = derived(transferData, ($transferData) => $transferData.step)

    function fetchFioData() {
        loadFee($activeBlockchain, activeSessionObject).then((fee) => {
            txFee = fee
        })
        loadBalance($activeBlockchain, activeSessionObject).then((assets) => {
            balance = assets[0]
        })
    }

    function resetData() {
        amount = ''
        toAccount = ''
        toAddress = ''
        memo = ''
        step = 'recipient'
    }

    function getActionData() {
        let data: ABISerializable = Transfer.from({
            from: activeSession!.auth.actor,
            to: toAccount,
            quantity,
            memo,
        })

        switch (String(activeBlockchain.coreTokenContract)) {
            case 'fio.token': {
                data = FIOTransfer.from({
                    payee_public_key: toAddress,
                    amount: quantity && quantity.units,
                    max_fee: txFee.units,
                    actor: activeSession!.auth.actor,
                    tpid: 'tpid@greymass',
                })
            }
        }
        return data
    }

    async function handleTransfer() {
        activeSession!
            .transact({
                action: {
                    authorization: [activeSession!.auth],
                    account: activeBlockchain.coreTokenContract,
                    name: activeBlockchain.coreTokenTransfer,
                    data: getActionData(),
                },
            })
            .then((result) => {
                console.log('done!', result)
                amount = ''
                toAccount = ''
                toAddress = ''
                memo = ''
                displaySuccessTx = transferData?.payload?.tx

                step = 'amount'
            })
    }

    $: {
        activeSessionObject = $activeSession!
    }

    $: if ($activeBlockchain.id === 'fio') {
        // Adding delay to give time for $activeSession to catch up
        setTimeout(() => {
            fetchFioData()
            resetData()
        }, 200)
    }

    $: if ($activeBlockchain.id !== 'fio') {
        txFee = Asset.fromUnits(0, $activeBlockchain.coreTokenSymbol)
        balance =
            $currentAccount?.core_liquid_balance ||
            Asset.fromUnits(0, $activeBlockchain.coreTokenSymbol)

        resetData()
    }

    $: {
        let toName = Name.from(toAccount)
        toAccount = String(toName)
    }

    $: {
        let parsed = parseFloat(amount)
        if (isNaN(parsed) || parsed === 0) {
            quantity = Asset.fromUnits(0, $activeBlockchain.coreTokenSymbol)
        } else {
            quantity = Asset.fromFloat(parsed, $activeBlockchain.coreTokenSymbol)
        }
    }
    $: {
        balanceValue = (balance && balance.units.toNumber())!
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

        {#if quantity && txFee.value > 0}
            <TransferSummary activeBlockchain={$activeBlockchain} {quantity} {txFee} />
        {/if}

        <br />

        {#if step === Step.Recipient}
            <TransferRecipient
                activeBlockchain={$activeBlockchain}
                activeSession={activeSessionObject}
                bind:step
                bind:toAddress
                bind:toAccount
            />
        {/if}

        {#if step === Step.Amount}
            <TransferAmount
                activeBlockchain={$activeBlockchain}
                activeSession={activeSessionObject}
                availableBalance={balanceValue}
                bind:toAddress
                bind:toAccount
                bind:amount
                bind:step
            />
        {/if}

        {#if step === Step.Confirm}
            <TransferConfirm
                activeBlockchain={$activeBlockchain}
                activeSession={activeSessionObject}
                availableBalance={balanceValue}
                {handleTransfer}
                {quantity}
                {txFee}
                bind:amount
                bind:memo
                bind:step
                bind:toAccount
                bind:toAddress
            />
        {/if}

        <Modal opened={!!displaySuccessTx}>
            <TransactionNotificationSuccess tx={displaySuccessTx} {activeBlockchain} />
        </Modal>
    </div>
</Page>
