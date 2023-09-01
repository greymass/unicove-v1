<script lang="ts">
    import {Asset, TransactResult} from 'anchor-link'
    import type {ethers} from 'ethers'

    import {activeSession, evmAccount} from '~/store'

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

    async function transfer() {
        if (!$evmAccount) {
            return (errorMessage = 'An evm session is required.')
        }

        try {
            if (from?.name === 'EOS') {
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

        deposit = (parseFloat(received) + parseFloat(transferFee?.value.toFixed(4) || '')).toFixed(4)
    }

    async function estimateTransferFee(): Promise<Asset | undefined> {
        console.log({from, to, deposit})
        if (!$evmAccount) {
            errorMessage = 'An evm session is required.'
            return
        }

        try {
            if (from?.name === 'EOS') {
                transferFee = await getNativeTransferFee({
                    nativeSession: $activeSession!,
                })
            } else {
                transferFee = await getGasAmount({
                    nativeSession: $activeSession!,
                    evmAccount: $evmAccount,
                    amount: deposit,
                })
            }
        } catch (error) {
             errorMessage = `Could not estimate transfer fee. Error: ${
                JSON.stringify(error) === '{}' ? error.message : JSON.stringify(error)
            }`
            return
        }

        return transferFee
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

    function getEvmBalance() {
        $evmAccount?.getBalance().then((balance) => {
            evmBalance = Asset.from(Number(balance.split(' ')[0]), '4,EOS')
        })
    }

    function updateBalances() {
        console.log('updateBalances')
        updateAccount($activeSession!.auth.actor, $activeSession!.chainId)
        getEvmBalance()
    }

    $: {
        if ($evmAccount) {
            getEvmBalance()
        }
    }

    connectInterval = window.setInterval(connectEvmWallet, 3000)
    connectEvmWallet()

    $: {
        if (from && to && deposit !== '') {
            estimateTransferFee()
        }
    }
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
                feeAmount={transferFee}
                receivedAmount={Asset.from(Number(received), '4,EOS')}
                {evmBalance}
                bind:amount={received}
                bind:from
                bind:to
            />
        {:else if step === 'confirm'}
            <Confirm
                depositAmount={Asset.from(Number(deposit), '4,EOS')}
                receivedAmount={Asset.from(Number(received), '4,EOS')}
                feeAmount={transferFee}
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
