<script lang="ts">
    import {Asset, TransactResult} from 'anchor-link'
    import type {ethers} from 'ethers'

    import {activeSession, evmAccount} from '~/store'

    import {transferNativeToEvm, transferEvmToNative, connectEthWallet, estimateGas, getGasAmount} from '~/lib/evm'

    import Page from '~/components/layout/page.svelte'
    import Form from './form.svelte'
    import Confirm from './confirm.svelte'
    import Success from './success.svelte'
    import Error from './error.svelte'
    import type {Token} from '~/stores/tokens'

    let step = 'form'
    let amount: string = ''
    let errorMessage: string | undefined
    let from: Token | undefined
    let to: Token | undefined
    let nativeTransactResult: TransactResult | undefined
    let evmTransactResult: ethers.providers.TransactionResponse | undefined
    let transferFee: Asset | undefined

    async function transfer() {
        if (!$evmAccount) {
            return (errorMessage = 'An evm session is required.')
        }

        try {
            if (from?.name === 'EOS') {
                nativeTransactResult = await transferNativeToEvm({
                    nativeSession: $activeSession!,
                    evmAccount: $evmAccount,
                    amount,
                })
            } else {
                evmTransactResult = await transferEvmToNative({
                    nativeSession: $activeSession!,
                    evmAccount: $evmAccount,
                    amount,
                })
            }
        } catch (error) {
            return (errorMessage = `Could not transfer. Error: ${
                JSON.stringify(error) === '{}' ? error.message : JSON.stringify(error)
            }`)
        }

        step = 'success'
    }

    function handleBack() {
        step = 'form'
        errorMessage = undefined
        nativeTransactResult = undefined
        evmTransactResult = undefined
        amount = ''
    }

    async function submitForm() {
        if (!$evmAccount) {
            return (errorMessage = 'An evm session is required.')
        }
        
        step = 'confirm'

        transferFee = await getGasAmount({
            nativeSession: $activeSession!,
            evmAccount: $evmAccount,
            amount,
        })
    }

    let connectInterval: number | undefined
    let connectingToEvmWallet = false

    async function connectEvmWallet() {
        let ethWalletAccount

        if (connectingToEvmWallet || !!$evmAccount) {
            return
        }

        connectingToEvmWallet = true

        try {
            ethWalletAccount = await connectEthWallet()
        } catch (e) {
            if (e.code === -32002) {
                return
            }

            if (!e.message) {
                return (connectingToEvmWallet = false)
            }

            return (errorMessage = `Could not connect to ETH wallet. Error: ${e.message}`)
        }

        if (ethWalletAccount) {
            evmAccount.set(ethWalletAccount)
            connectInterval && clearInterval(connectInterval)
            connectingToEvmWallet = false
        }
    }

    connectInterval = window.setInterval(connectEvmWallet, 3000)
    connectEvmWallet()
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
        {:else if step === 'form' || !from || !to || !amount}
            <Form handleContinue={submitForm} bind:amount bind:from bind:to />
        {:else if step === 'confirm'}
            <Confirm depositAmount={Asset.from(Number(amount), '4,EOS')} feeAmount={transferFee} {from} {to} handleConfirm={transfer} {handleBack} />
        {:else if (step === 'success' && nativeTransactResult) || evmTransactResult}
            <Success {from} {to} {nativeTransactResult} {evmTransactResult} {handleBack} />
        {/if}
    </div>
</Page>
