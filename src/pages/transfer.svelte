<script lang="ts">
    import type {LinkSession} from 'anchor-link'

    import {Asset} from 'anchor-link'

    import {Step} from './transfer/types'

    import {activeBlockchain, activeSession, currentAccount, currentTxFees} from '../store'

    import {FIOTransfer, Transfer} from '~/abi-types'

    import {transferData, quantity} from './transfer/transferData'

    import TransferBalance from './transfer/balance.svelte'
    import TransferSummary from './transfer/summary.svelte'
    import TransferRecipient from './transfer/recipient.svelte'
    import TransferAmount from './transfer/amount.svelte'
    import TransferConfirm from './transfer/confirm.svelte'

    import Modal from '~/components/elements/modal.svelte'
    import Page from '~/components/layout/page.svelte'

    let activeSessionObject: LinkSession

    let balance: Asset = Asset.fromUnits(0, $activeBlockchain.coreTokenSymbol)

    $: {
       if ($currentAccount) {
          balance = $currentAccount.core_liquid_balance
       }
    }


    let displaySuccessTx: string | undefined = undefined

    let previousChain
    let balanceValue

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
                    max_fee: $currentTxFees!.units,
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

    $: if ($activeBlockchain.id !== previousChain) {
        resetData()

        previousChain = $activeBlockchain.id
    }

    $: {
        balanceValue = (balance && balance.units.toNumber())!
        console.log({fee: $currentTxFees})
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

        {#if $quantity && $currentTxFees && $currentTxFees.value > 0}
            <TransferSummary activeBlockchain={$activeBlockchain} quantity={$quantity} txFee={$currentTxFees} />
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
                txFee={$currentTxFees}
                {handleTransfer}
            />
        {/if}

        <Modal opened={!!displaySuccessTx}>
            <TransactionNotificationSuccess tx={displaySuccessTx} {activeBlockchain} />
        </Modal>
    </div>
</Page>
