<script lang="ts">
    import {Asset, TransactResult} from 'anchor-link'
    import type {ethers} from 'ethers'

    import {currentAccountBalance, activeSession, activeEvmSession, activeBlockchain} from '~/store'

    import Page from '~/components/layout/page.svelte'
    import Form from './form.svelte'
    import Confirm from './confirm.svelte'
    import Success from './success.svelte'
    import Error from './error.svelte'
    import {updateAccount} from '~/stores/account-provider'
    import {systemToken} from '~/stores/tokens'
    import { transferTypes } from './transferManager'
    import { createEvmBridge } from '~/lib/evm'

    import type {Token} from '~/stores/tokens'

    let step = 'form'
    let deposit: string = ''
    let received: string = ''
    let errorMessage: string | undefined
    let from: Token | undefined
    let to: Token | undefined
    let transactResult: TransactResult | ethers.providers.TransactionResponse | undefined
    let transferFee: Asset | undefined
    let evmBalance: Asset | undefined

    $: nativeAccountName = String($systemToken?.symbol.code)
    $: systemContractSymbol = String($systemToken?.symbol)
    $: transferType = (from?.name && to?.name) ? transferTypes[`${from.name} - ${to?.name}` as keyof typeof transferTypes] : undefined

    async function useEntireBalance() {
        if (!from || !to) return

        let value
        if (transferType?.from === 'evm') {
            value = evmBalance?.value
        } else if (from?.name === nativeAccountName) {
            value = $currentAccountBalance?.value
        }

        await estimateTransferFee(String(value))

        received = ((value || 0) - (transferFee?.value || 0))?.toFixed(4)
    }

    async function transfer() {
        try {
            transactResult = await transferType?.transfer({ nativeSession: $activeSession!, evmSession: $activeEvmSession, amount: deposit })
        } catch (error) {
            return (errorMessage = `Could not transfer. Error: ${
                JSON.stringify(error) === '{}' ? error.message : JSON.stringify(error)
            }`)
        }

        setTimeout(updateBalances, 20000) // Waiting a 20 seconds and then updating the balances

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
            transferFee = transferType?.transferFee && await transferType.transferFee({
                nativeSession: $activeSession!,
                evmSession: $activeEvmSession,
                amount: transferAmount || received,
            })
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

    function getEvmBalance() {
        $activeEvmSession?.getBalance().then((balance) => {
            evmBalance = Asset.from(Number(balance.split(' ')[0]), systemContractSymbol)
        })
    }

    function updateBalances() {
        updateAccount($activeSession!.auth.actor, $activeSession!.chainId)
        getEvmBalance()
    }

    $: {
        if ($activeEvmSession) {
            getEvmBalance()
        }
    }

    async function handlePageLoad() {
        // For now we are always connecting to evm wallet on page load. This may change in the future.
        await createEvmBridge()
    }

    handlePageLoad()

    $: {
        if (transferType && received !== '' && Number(received) > 0) {
            estimateTransferFee()
        }
    }

    $: {
        if (transferFee && received !== '') {
            deposit = (parseFloat(received) + parseFloat(transferFee?.value.toFixed(4))).toFixed(4)
        }
    }

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
        {:else if step === 'form' || !transferType || !deposit || !received}
            <Form
                handleContinue={submitForm}
                {depositAmount}
                {receivedAmount}
                {evmBalance}
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
                {transferType}
                feeAmount={transferFee}
                handleConfirm={transfer}
                {handleBack}
            />
        {:else if (step === 'success' && transactResult)}
            <Success {transactResult} {handleBack} />
        {/if}
    </div>
</Page>
