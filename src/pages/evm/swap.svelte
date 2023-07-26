<script lang="ts">
    import type {TransactResult} from 'anchor-link'
    import type {ethers} from 'ethers'

    import {activeSession, evmAccount} from '~/store'

    import {transferNativeToEvm, transferEvmToNative, connectEthWallet} from '~/lib/evm'

    import Page from '~/components/layout/page.svelte'
    import Form from './swap/form.svelte'
    import Confirm from './swap/confirm.svelte'
    import Success from './swap/success.svelte'
    import Error from './swap/error.svelte'
    import type { Token } from '~/stores/tokens'

    type AccountType = 'Native' | 'EVM'

    let step = 'form'
    let amount: string = ''
    let errorMessage: string | undefined
    let from: Token | undefined
    let to: Token | undefined
    let nativeTransactResult: TransactResult | undefined
    let evmTransactResult: ethers.providers.TransactionResponse | undefined

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
        step = 'confirm'
    }

    let connectInterval: number | undefined;
    let connectingToEvmWallet = false;

    async function connectEvmWallet() {
        let ethWalletAccount

        if (connectingToEvmWallet || !!$evmAccount) {
            return
        }

        connectingToEvmWallet = true;

        try {
            ethWalletAccount = await connectEthWallet()
        } catch (e) {
            console.log({code: e.code})

            if (e.code === -32002) {
                return
            }

            if (!e.message) {
                return connectingToEvmWallet = false;
            }

            return (errorMessage = `Could not connect to ETH wallet. Error: ${e.message}`)
        }

        if (ethWalletAccount) {
            evmAccount.set(ethWalletAccount)
            connectInterval && clearInterval(connectInterval); 
            connectingToEvmWallet = false;
        }
    }

    connectInterval = window.setInterval(connectEvmWallet, 3000);
    connectEvmWallet();
</script>

<style type="scss">
    div {
        max-width: 700px;
        margin: 0 auto;
    }
</style>

<Page divider={false}>
    <div class="container">
        {#if errorMessage}
            <Error error={errorMessage} {handleBack} />
        {:else if step === 'form' || !from || !to}
            <Form handleContinue={submitForm} bind:amount bind:from bind:to />
        {:else if step === 'confirm'}
            <Confirm
                {amount}
                {from}
                {to}
                handleConfirm={transfer}
                {handleBack}
            />
        {:else if (step === 'success' && nativeTransactResult) || evmTransactResult}
            <Success {from} {to} {nativeTransactResult} {evmTransactResult} {handleBack} />
        {/if}
    </div>
</Page>
