<script lang="ts">
    import {Asset} from 'anchor-link'

    import {Step} from './transfer/types'
    import type {TransferData} from './transfer/types'

    import {activeBlockchain, activeSession, currentAccount, currentTxFee} from '../store'

    import {FIOTransfer, Transfer} from '~/abi-types'

    import {transferData, quantity} from './transfer/transferData'

    import TransactionNotificationSuccess from '~/components/elements/notification/transaction/success.svelte'

    import TransferBalance from './transfer/balance.svelte'
    import TransferSummary from './transfer/summary.svelte'
    import TransferRecipient from './transfer/recipient.svelte'
    import TransferAmount from './transfer/amount.svelte'
    import TransferConfirm from './transfer/confirm.svelte'

    import Modal from '~/components/elements/modal.svelte'
    import Page from '~/components/layout/page.svelte'

    let balance: Asset = Asset.fromUnits(0, $activeBlockchain.coreTokenSymbol)

    $: {
        balance =
            $currentAccount?.core_liquid_balance ||
            Asset.fromUnits(0, $activeBlockchain.coreTokenSymbol)
    }

    let displaySuccessTx: string | undefined = undefined
    let previousChain: string | undefined = undefined
    let balanceValue: number | undefined = undefined

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
        let data: TransferData = Transfer.from({
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
                    max_fee: $currentTxFee!.units,
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

    $: if ($activeBlockchain.id !== previousChain) {
        resetData()

        previousChain = $activeBlockchain.id
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

        {#if $quantity && $currentTxFee}
            <TransferSummary txFee={$currentTxFee} />
        {/if}

        <br />

        {#if $transferData.step === Step.Recipient}
            <TransferRecipient />
        {/if}

        {#if $transferData.step === Step.Amount}
            <TransferAmount availableBalance={balanceValue} />
        {/if}

        {#if $transferData.step === Step.Confirm}
            <TransferConfirm availableBalance={balanceValue} {handleTransfer} />
        {/if}

        <Modal opened={!!displaySuccessTx}>
            <TransactionNotificationSuccess
                onClose={() => (displaySuccessTx = undefined)}
                activeBlockchain={$activeBlockchain}
                tx={displaySuccessTx}
            />
        </Modal>
    </div>
</Page>
