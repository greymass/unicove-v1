<script lang="ts">
    import {Asset, TransactResult} from 'anchor-link'
    import type {ethers} from 'ethers'

    import {activeSession, activeEvmSession} from '~/store'

    import Page from '~/components/layout/page.svelte'
    import Form from './form.svelte'
    import Confirm from './confirm.svelte'
    import Success from './success.svelte'
    import Error from './error.svelte'
    import {systemToken} from '~/stores/tokens'
    import { transferManagers } from './managers'
    import type { TransferManager } from './managers/transferManager'
    import { startEvmSession } from '~/lib/evm'

    import type {Token} from '~/stores/tokens'

    let step = 'form'
    let deposit: string = ''
    let received: string = ''
    let errorMessage: string | undefined
    let from: Token | undefined
    let to: Token | undefined
    let transactResult: TransactResult | ethers.providers.TransactionResponse | undefined
    let transferFee: Asset | undefined
    let transferManager: TransferManager | undefined

    $: systemContractSymbol = String($systemToken?.symbol)
    $: {
        const TransferManagerClass = (from?.name && to?.name) ? transferManagers[`${from.name} - ${to?.name}`] : undefined
        if (TransferManagerClass) {
            transferManager = new (TransferManagerClass as unknown as new (...args: any[]) => TransferManager)(
                $activeSession!,
                $activeEvmSession,
            )
        }
    }

    async function useEntireBalance() {
        if (!from || !to) return

        const balance = await transferManager?.balance()

        if (!balance) return

        const balanceValue = balance.value
       
        await estimateTransferFee(String(balanceValue))

        received = ((balanceValue || 0) - (transferFee?.value || 0))?.toFixed(4)
    }

    async function transfer() {
        try {
            transactResult = await transferManager?.transfer(deposit)
        } catch (error) {
            return (errorMessage = `Could not transfer. Error: ${
                JSON.stringify(error) === '{}' ? error.message : JSON.stringify(error)
            }`)
        }

        setTimeout(() => {
            transferManager?.updateBalances()
        }, 20000) // Waiting a 20 seconds and then updating the balances

        step = 'success'
    }
    

    function handleBack() {
        step = 'form'
        errorMessage = undefined
        transactResult = undefined
        deposit = ''
        received = ''
    }

    async function submitForm() {
        step = 'confirm'

        await estimateTransferFee()

        deposit = (parseFloat(received) + parseFloat(transferFee?.value.toFixed(4) || '')).toFixed(4)
    }

    async function estimateTransferFee(transferAmount?: string): Promise<Asset | undefined> {
        if (!$activeEvmSession) {
            errorMessage = 'An evm session is required.'
            return
        }

        try {
            transferFee = await transferManager?.transferFee(transferAmount || received)
        } catch (error) {
            if (!error?.data?.message?.includes('insufficient funds for transfer')) {
                errorMessage = `Could not estimate transfer fee. Error: ${
                    JSON.stringify(error) === '{}' ? error.message : JSON.stringify(error)
                }`
            }
            return
        }

        return transferFee
    }

    async function handlePageLoad() {
        // For now, we are always connecting to evm wallet on page load. This may change in the future.
        await startEvmSession()
    }

    handlePageLoad()

    $: {
        if (transferManager && received !== '' && Number(received) > 0) {
            estimateTransferFee()
        }
    }

    $: {
        if (transferFee && received !== '') {
            deposit = (parseFloat(received) + parseFloat(transferFee?.value.toFixed(4))).toFixed(4)
        }
    }

    // Eventually we may want to get the symbol from the transferManager instead of the systemToken
    $: receivedAmount = isNaN(Number(received)) ? undefined : Asset.from(Number(received), systemContractSymbol)
    $: depositAmount = Asset.from(Number(deposit), systemContractSymbol)
</script>

<style type="scss">
    div {
        max-width: 800px;
        margin: 0 auto;
    }
</style>

<Page divider={false}>
    <div class="container">
        {#if errorMessage}
            <Error error={errorMessage} {handleBack} />
        {:else if step === 'form' || !transferManager || !deposit || !received}
            <Form
                handleContinue={submitForm}
                {depositAmount}
                {receivedAmount}
                {transferManager}
                {useEntireBalance}
                bind:feeAmount={transferFee}
                bind:amount={received}
                bind:from
                bind:to
            />
        {:else if step === 'confirm' && receivedAmount}
            <Confirm
                {depositAmount}
                {receivedAmount}
                {transferManager}
                feeAmount={transferFee}
                handleConfirm={transfer}
                {handleBack}
            />
        {:else if (step === 'success' && transactResult)}
            <Success {transactResult} {handleBack} />
        {/if}
    </div>
</Page>
