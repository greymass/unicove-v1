<script lang="ts">
    import {Asset, LinkSession, TransactResult} from 'anchor-link'
    import type {ethers} from 'ethers'

    import {activeSession, activeEvmSession} from '~/store'

    import Page from '~/components/layout/page.svelte'
    import Form from './form.svelte'
    import Confirm from './confirm.svelte'
    import Success from './success.svelte'
    import Error from './error.svelte'
    import {systemToken} from '~/stores/tokens'
    import {TransferType, transferManagers} from './managers'
    import type {TransferManager} from './managers/transferManager'
    import {startEvmSession} from '~/lib/evm'

    import type {Token} from '~/stores/tokens'
    import { balances } from '~/stores/balances'

    let step = 'form'
    let deposit: string = ''
    let received: string = ''
    let errorMessage: string | undefined
    let from: Token | undefined
    let to: Token | undefined
    let transactResult: TransactResult | ethers.providers.TransactionResponse | undefined
    let transferFee: Asset | undefined
    let transferManagerData: TransferType | undefined
    let transferManager: TransferManager | undefined

    $: systemContractSymbol = String($systemToken?.symbol)
    $: balance = $balances?.find((balance) => balance.tokenKey === from?.key)?.quantity
    $: receivingBalance = $balances?.find((balance) => balance.tokenKey === to?.key)?.quantity
    $: {
        transferManagerData =
            from?.name && to?.name ? transferManagers[`${from.name} - ${to?.name}`] : undefined

        const TransferManagerClass = transferManagerData?.transferClass

        if (TransferManagerClass) {
            transferManager = new (TransferManagerClass as unknown as new (
                ...args: any[]
            ) => TransferManager)($activeSession!, $activeEvmSession, transferManagerData)
        }
    }

    async function useEntireBalance() {
        if (!from || !to || !balance) return

        const balanceValue = balance.value

        await estimateTransferFee(String(balanceValue))

        const transferFeeValue = transferFee?.value || 0

        received = (
            (balanceValue || 0) - (transferFeeValue === 0 ? 0 : transferFeeValue)
        )?.toFixed(4)
    }

    async function transfer() {
        try {
            transactResult = await transferManager?.transfer(deposit, from!.symbol)
        } catch (error) {
            return (errorMessage = `Could not transfer. Error: ${
                error.underlyingError?.message || JSON.stringify(error) === '{}'
                    ? error.message
                    : JSON.stringify(error)
            }`)
        }

        step = 'success'
    }

    function handleBack(updateBalances = false) {
        step = 'form'
        errorMessage = undefined
        transactResult = undefined
        deposit = ''
        received = ''
    }

    async function submitForm() {
        step = 'confirm'

        await estimateTransferFee()

        deposit = (parseFloat(received) + parseFloat(transferFee?.value.toFixed(4) || '')).toFixed(
            4
        )
    }

    async function estimateTransferFee(transferAmount?: string): Promise<Asset | undefined> {
        if (!$activeEvmSession) {
            errorMessage = 'An evm session is required.'
            return
        }

        try {
            console.log({from})
            transferFee = await transferManager?.transferFee(transferAmount || received, from?.symbol)
        } catch (error) {
            if (
                !error?.data?.message?.includes('insufficient funds for transfer') &&
                !error?.data?.message?.includes('gas required exceeds allowance')
            ) {
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

    let previousSession: LinkSession | undefined

    $: {
        if (!previousSession) {
            previousSession = $activeSession
        }
    }

    $: {
        if (
            previousSession &&
            String($activeSession?.chainId) !== String(previousSession?.chainId)
        ) {
            startEvmSession()
            previousSession = $activeSession
        }
    }

    // Eventually we may want to get the symbol from the transferManager instead of the systemToken
    $: receivedAmount = isNaN(Number(received))
        ? undefined
        : Asset.from(Number(received), from?.symbol || systemContractSymbol)
    $: depositAmount = Asset.from(Number(deposit), from?.symbol || systemContractSymbol)
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
        {:else if step === 'confirm' && receivedAmount && transferManagerData}
            <Confirm
                {depositAmount}
                {receivedAmount}
                {transferManager}
                {transferManagerData}
                feeAmount={transferFee}
                handleConfirm={transfer}
                {handleBack}
            />
        {:else if step === 'success' && transactResult}
            <Success {transactResult} {transferManager} {balance} {receivingBalance} {handleBack} />
        {/if}
    </div>
</Page>
