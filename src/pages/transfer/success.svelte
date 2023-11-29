<script lang="ts">
    import TxFollower from '~/components/tx-follower/index.svelte'
    import EvmTxFollower from '~/components/evm-tx-follower/index.svelte'
    import type {Asset, TransactResult} from 'anchor-link'
    import type {ethers} from 'ethers'

    import {activeBlockchain} from '~/store'
    import type {TransferManager} from './managers/transferManager'
    import {updateBalances} from '~/stores/balances-provider'
    import {activeSession} from '~/store'
    import {get} from 'svelte/store'

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

        // Start an interval to continously monitor for changes to that value
        refreshInterval = setInterval(async () => {
            // Fetch the balances
            updateBalances(get(activeSession)!)
        }, 5000)

        // Timeout after 60 seconds
        setTimeout(() => {
            clearInterval(refreshInterval)
        }, 60000)
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
