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

    let step = 'form'
    let amount: string = '0.0000'
    let error: string | undefined
    let transferOption: 'nativeToEvm' | 'evmToNative' = 'nativeToEvm'
    let nativeTransactResult: TransactResult | undefined
    let evmTransactResult: ethers.providers.TransactionResponse | undefined

    async function transfer() {
        if (!$evmAccount) {
            return (error = 'An evm session is required.')
        }

        try {
            if (transferOption === 'nativeToEvm') {
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
            return (error = `Could not transfer. Error: ${error.message}`)
        }

        if (nativeTransactResult || evmTransactResult) {
            step = 'success'
        } else {
            error = 'Could not transfer.'
        }
    }

    function handleBack() {
        step = 'form'
        error = undefined
        nativeTransactResult = undefined
        evmTransactResult = undefined
        amount = '0.0000'
    }

    async function submitForm() {
        if ($evmAccount) {
            return (step = 'confirm')
        }

        connectEvmWallet()
    }

    async function connectEvmWallet() {
        let ethWalletAccount

        try {
            ethWalletAccount = await connectEthWallet()
        } catch (e) {
            return (error = `Could not connect to ETH wallet. Error: ${e.message}`)
        }

        evmAccount.set(ethWalletAccount)
    }
</script>

<style type="scss">
    div {
        max-width: 700px;
        margin: 0 auto;
    }
</style>

<Page divider={false}>
    <div class="container">
        {#if error}
            <Error {error} {handleBack} />
        {:else if step === 'form'}
            <Form handleContinue={submitForm} {connectEvmWallet} bind:amount bind:transferOption />
        {:else if step === 'confirm'}
            <Confirm
                {amount}
                from={transferOption === 'nativeToEvm' ? 'Native' : 'EVM'}
                to={transferOption === 'nativeToEvm' ? 'EVM' : 'Native'}
                handleConfirm={transfer}
                {handleBack}
            />
        {:else if (step === 'success' && nativeTransactResult) || evmTransactResult}
            <Success {transferOption} {nativeTransactResult} {evmTransactResult} {handleBack} />
        {/if}
    </div>
</Page>
