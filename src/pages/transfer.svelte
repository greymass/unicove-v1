<script lang="ts">
    import type {LinkSession} from 'anchor-link'

    import {Asset, Name} from 'anchor-link'

    import {Step} from './transfer/types'

    import {activeBlockchain, activeSession, currentAccount} from '../store'

    import {FIOTransfer, Transfer} from '~/abi-types'

    import {transferData, quantity} from './transfer/transferData'

    import TransferBalance from './transfer/balance.svelte'
    import TransferSummary from './transfer/summary.svelte'
    import TransferRecipient from './transfer/recipient.svelte'
    import TransferAmount from './transfer/amount.svelte'
    import TransferConfirm from './transfer/confirm.svelte'

    import Modal from '~/components/elements/modal.svelte'
    import Page from '~/components/layout/page.svelte'

    import {loadFee, loadBalance} from '~/services/eosio/transfer/fio'

    let activeSessionObject: LinkSession

    let txFee: Asset = Asset.fromUnits(0, $activeBlockchain.coreTokenSymbol)
    let balance: Asset = Asset.fromUnits(0, $activeBlockchain.coreTokenSymbol)

    let balanceValue: number = 0
    let displaySuccessTx: string | undefined = $transferData.displaySuccessTx

    function fetchFioData() {

        loadBalance($activeBlockchain, activeSessionObject).then((assets) => {
            balance = assets[0]
        })
    }

    function resetData() {
        transferData.set({
            amount: '',
            toAccount: '',
            toAddress: '',
            memo: '',
            step: Step.Recipient,
        })
    }

    function getActionData() {
        let data: ABISerializable = Transfer.from({
            from: $activeSession!.auth.actor,
            to: $transferData.toAccount,
            quantity: $quantity,
            memo: $transferData.memo,
        })

        switch (String($activeBlockchain.coreTokenContract)) {
            case 'fio.token': {
                data = FIOTransfer.from({
                    payee_public_key: $transferData.toAddress,
                    amount: $quantity && $quantity.units,
                    max_fee: txFee.units,
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
                    account: $activeBlockchain.coreTokenContract,
                    name: $activeBlockchain.coreTokenTransfer,
                    data: getActionData(),
                },
            })
            .then((result) => {
                console.log('done!', result)

                displaySuccessTx = result?.payload?.tx

                resetData()
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

        {#if $quantity && txFee.value > 0}
            <TransferSummary activeBlockchain={$activeBlockchain} quantity={$quantity} {txFee} />
        {/if}

        <br />

        {#if $transferData.step === Step.Recipient}
            <TransferRecipient
                activeBlockchain={$activeBlockchain}
                activeSession={activeSessionObject}
            />
        {/if}

        {#if $transferData.step === Step.Amount}
            <TransferAmount
                activeBlockchain={$activeBlockchain}
                activeSession={activeSessionObject}
                availableBalance={balanceValue}
            />
        {/if}

        {#if $transferData.step === Step.Confirm}
            <TransferConfirm
                activeBlockchain={$activeBlockchain}
                activeSession={activeSessionObject}
                availableBalance={balanceValue}
                quantity={$quantity}
                {handleTransfer}
                {txFee}
            />
        {/if}

        <Modal opened={!!displaySuccessTx}>
            <TransactionNotificationSuccess tx={displaySuccessTx} {activeBlockchain} />
        </Modal>
    </div>
</Page>
