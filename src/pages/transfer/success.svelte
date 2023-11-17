<script lang="ts">
    import TxFollower from '~/components/tx-follower/index.svelte'
    import EvmTxFollower from '~/components/evm-tx-follower/index.svelte'
    import type {Asset, TransactResult} from 'anchor-link'
    import type {ethers} from 'ethers'

    import {activeBlockchain} from '~/store'
    import type {TransferManager} from './managers/transferManager'
    import {updateBalances} from '~/stores/balances-provider'
    import {activeSession} from '~/store'

    export let transferManager: TransferManager
    export let transactResult: TransactResult | ethers.providers.TransactionResponse
    export let handleBack: () => void
    export let balance: Asset | undefined
    export let receivingBalance: Asset | undefined

    let refreshInterval: NodeJS.Timeout

    async function awaitBalancesUpdate() {
        // Create a copy of the initial value
        const initialSendingBalance = balance
        const initialReceivedBalance = receivingBalance

        if (!initialSendingBalance) return
        if (!initialReceivedBalance) return

        // Set the current value equal to the initial value
        let currentSendingBalance: Asset | undefined
        let currentReceivedBalance: Asset | undefined

        // Start an interval to continously monitor for changes to that value
        refreshInterval = setInterval(async () => {
            currentSendingBalance = balance
            currentReceivedBalance = receivingBalance

            // If the balances changed, stop the interval
            if (
                (!currentSendingBalance || !currentSendingBalance.equals(initialSendingBalance)) &&
                (!currentReceivedBalance || !currentReceivedBalance.equals(initialReceivedBalance))
            ) {
                clearInterval(refreshInterval)
            }
            // Fetch the balances
            updateBalances($activeSession!)
        }, 1000)

        // Timeout after 30 seconds
        setTimeout(() => {
            clearInterval(refreshInterval)
        }, 30000)
    }

    awaitBalancesUpdate()
</script>

{#if 'payload' in transactResult}
    <TxFollower
        title="Transfer Sent"
        id={transactResult.payload.tx}
        chain={$activeBlockchain}
        primaryButtonText="New Transfer"
        handlePrimaryButtonClick={handleBack}
    />
{:else}
    <EvmTxFollower
        title="Transfer Sent"
        evmTransactResult={transactResult}
        primaryButtonText="New Transfer"
        handlePrimaryButtonClick={handleBack}
    />
{/if}
