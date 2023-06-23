

<script lang="ts">
    import {writable} from 'svelte/store'
    import type {Writable} from 'svelte/store'
    import type { TransactResult } from 'anchor-link'
    import type { ethers } from 'ethers'

    import {activeSession} from '~/store'

    import {EthAccount, transferEOSToEth, transferETHToEOS, connectEthWallet} from '~/lib/evm'

    import Page from '~/components/layout/page.svelte'
    import Form from './swap/form.svelte'
    import Confirm from './swap/confirm.svelte'
    import Success from './swap/success.svelte'
    import Error from './swap/error.svelte'

    const ethAccount: Writable<EthAccount | null> = writable(null)

    let step = 'form'
    let amount: string = '0.0000'
    let error: string | undefined
    let transferOption: 'nativeToEvm' | 'evmToNative' = 'nativeToEvm'
    let transactResult: TransactResult | ethers.providers.TransactionResponse | undefined

    async function transfer() {
        const ethWalletAccount = await connectEthWallet()
        if (!ethWalletAccount) {
            return error = 'Could not connect to ETH wallet.'
        }
        ethAccount.set(ethWalletAccount)

        if (transferOption === 'nativeToEvm') {
            transactResult = await transferEOSToEth({ nativeSession: $activeSession!, ethAccount: ethWalletAccount, amount })
        } else {
            transactResult = await transferETHToEOS({ nativeSession: $activeSession!, ethAccount: ethWalletAccount, amount })
        }

        if (transactResult) {
            step = 'success'
        } else {
            error = 'Could not transfer.'
        }
    }

    function handleReset() {
        step = 'form'
        error = undefined
        transactResult = undefined
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
            <Error error={error} handleReset={handleReset} />
        {:else if step === 'form'}
            <Form handleContinue={() => step = 'confirm'} bind:amount={amount} bind:transferOption={transferOption} />
        {:else if step === 'confirm'}
            <Confirm
                amount={amount}
                from={transferOption === 'nativeToEvm' ? 'EOS (Native)' : 'EOS (EVM)'}
                to={transferOption === 'nativeToEvm' ? 'EOS (EVM)' : 'EOS (Native)'}
                handleConfirm={transfer}
                handleBack={() => step = 'form'}
            />
        {:else if step === 'success' && transactResult}
            <Success transferOption={transferOption} transactResult={transactResult} />
        {/if}
    </div>
</Page>
