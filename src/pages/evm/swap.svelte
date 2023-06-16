

<script lang="ts">
    import {writable} from 'svelte/store'
    import type {Writable} from 'svelte/store'
    import {activeSession} from '~/store'

    import {EthAccount, transferEOSToEth, transferETHToEOS, connectEthWallet} from '~/lib/evm'

    import Page from '~/components/layout/page.svelte'
    import Form from './swap/form.svelte'
    import Confirm from './swap/confirm.svelte'
    import Success from './swap/success.svelte'
    import type { TransactResult } from 'anchor-link'

    const ethAccount: Writable<EthAccount | null> = writable(null)

    let step = 'form'
    let amount: string = '0.0000'
    let transferOption: 'nativeToEvm' | 'evmToNative' = 'nativeToEvm'
    let transactResult: TransactResult | ethers.providers.result | undefined

    async function transfer() {
        const ethWalletAccount = await connectEthWallet()
        if (!ethWalletAccount) {
            throw new Error('Could not connect to ETH wallet.')
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
            throw new Error('Could not transfer.')
        }
    }
</script>

<style type="scss">
</style>

<Page divider={false}>
    {#if step === 'form'}
        <Form handleContinue={() => step = 'confirm'} bind:amount={amount} bind:transferOption={transferOption} />
    {:else if step === 'confirm'}
        <Confirm
            amount={amount}
            from={transferOption === 'nativeToEvm' ? 'EOS (Native)' : 'EOS (EVM)'}
            to={transferOption === 'nativeToEvm' ? 'EOS (EVM)' : 'EOS (Native)'}
            handleConfirm={transfer}
            handleBack={() => step = 'form'}
         />
    {:else if step === 'success'}
        <Success transferOption={transferOption} transactResult={transactResult} />
    {/if}
</Page>
