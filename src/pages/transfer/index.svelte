<script lang="ts">
    import {Asset, TransactResult} from 'anchor-link'
    import type {ethers} from 'ethers'

    import {currentAccountBalance, evmAccount, activeSession, activeBlockchain} from '~/store'

    import {
        transferNativeToEvm,
        transferEvmToNative,
        connectEthWallet,
        getGasAmount,
        getNativeTransferFee,
    } from '~/lib/evm'

    import Page from '~/components/layout/page.svelte'
    import Form from './form.svelte'
    import Confirm from './confirm.svelte'
    import Success from './success.svelte'
    import Error from './error.svelte'
    import type {Token} from '~/stores/tokens'
    import {updateAccount} from '~/stores/account-provider'
    import {systemToken} from '~/stores/tokens'

    let step = 'form'
    let deposit: string = ''
    let received: string = ''
    let errorMessage: string | undefined
    let from: Token | undefined
    let to: Token | undefined
    let nativeTransactResult: TransactResult | undefined
    let evmTransactResult: ethers.providers.TransactionResponse | undefined
    let transferFee: Asset | undefined
    let evmBalance: Asset | undefined

    $: nativeAccountName = String($systemToken?.symbol.code)
    $: evmAccountName = `${nativeAccountName} (EVM)`
    $: systemContractSymbol = String($systemToken?.symbol)

    async function useEntireBalance() {
        if (!from || !to) return

        let value
        if (from?.name === evmAccountName) {
            value = evmBalance?.value
        } else if (from?.name === nativeAccountName) {
            value = $currentAccountBalance?.value
        }

        await estimateTransferFee(String(value))

        received = ((value || 0) - (transferFee?.value || 0))?.toFixed(4)
    }

    async function transfer() {
        if (!$evmAccount) {
            return (errorMessage = 'An evm session is required.')
        }

        try {
            if (from?.name === nativeAccountName) {
                nativeTransactResult = await transferNativeToEvm({
                    nativeSession: $activeSession!,
                    evmAccount: $evmAccount,
                    amount: deposit,
                })
            } else {
                evmTransactResult = await transferEvmToNative({
                    nativeSession: $activeSession!,
                    evmAccount: $evmAccount,
                    amount: received,
                })
            }
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
        nativeTransactResult = undefined
        evmTransactResult = undefined
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
        if (!$evmAccount) {
            errorMessage = 'An evm session is required.'
            return
        }

        try {
            if (from?.name === nativeAccountName) {
                transferFee = await getNativeTransferFee({
                    nativeSession: $activeSession!,
                })
            } else {
                transferFee = await getGasAmount({
                    nativeSession: $activeSession!,
                    evmAccount: $evmAccount,
                    amount: transferAmount || received,
                })
            }
        } catch (error) {
            console.log({error})
            if (!error?.data?.message?.includes('insufficient funds for transfer')) {
                errorMessage = `Could not estimate transfer fee. Error: ${
                    JSON.stringify(error) === '{}' ? error.message : JSON.stringify(error)
                }`
            }
            return
        }

        return transferFee
    }

    let connectingToEvmWallet = false

    async function connectEvmWallet() {
        let evmWalletAccount

        if (connectingToEvmWallet || !!$evmAccount) {
            setTimeout(connectEvmWallet, 5000)
            return
        }

        connectingToEvmWallet = true

        try {
            console.log({ chainName: $activeBlockchain?.id})
            evmWalletAccount = await connectEthWallet(String($activeBlockchain?.id))
        } catch (e) {
            if (e.code === -32002) {
                setTimeout(connectEvmWallet, 5000)
                return
            }

            if (!e.message) {
                return (connectingToEvmWallet = false)
            }

            return (errorMessage = `Could not connect to EVM wallet. Error: ${e.message}`)
        }

        if (evmWalletAccount) {
            evmAccount.set(evmWalletAccount)
            connectingToEvmWallet = false
        }
    }

    function getEvmBalance() {
        $evmAccount?.getBalance().then((balance) => {
            evmBalance = Asset.from(Number(balance.split(' ')[0]), systemContractSymbol)
        })
    }

    function updateBalances() {
        updateAccount($activeSession!.auth.actor, $activeSession!.chainId)
        getEvmBalance()
    }

    $: {
        if ($evmAccount) {
            getEvmBalance()
        }
    }

    connectEvmWallet()

    $: {
        if (from && to && received !== '' && Number(received) > 0) {
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
        {:else if step === 'form' || !from || !to || !deposit || !received}
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
                feeAmount={transferFee}
                {from}
                {to}
                handleConfirm={transfer}
                {handleBack}
            />
        {:else if (step === 'success' && nativeTransactResult) || evmTransactResult}
            <Success {nativeTransactResult} {evmTransactResult} {handleBack} />
        {/if}
    </div>
</Page>
