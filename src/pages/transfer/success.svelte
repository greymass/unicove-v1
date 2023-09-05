<script lang="ts">
    import TxFollower from '~/components/tx-follower/index.svelte'
    import EvmTxFollower from '~/components/evm-tx-follower/index.svelte'
    import type {TransactResult} from 'anchor-link'
    import type {ethers} from 'ethers'

    import {activeBlockchain} from '~/store'

    export let nativeTransactResult: TransactResult | undefined
    export let evmTransactResult: ethers.providers.TransactionResponse | undefined
    export let handleBack: () => void
</script>

{#if nativeTransactResult}
    <TxFollower
        title="Transfer Sent"
        id={nativeTransactResult.payload.tx}
        chain={$activeBlockchain}
        primaryButtonText="New Transfer"
        handlePrimaryButtonClick={handleBack}
    />
{:else}
    <EvmTxFollower
        title="Transfer Sent"
        {evmTransactResult}
        primaryButtonText="New Transfer"
        handlePrimaryButtonClick={handleBack}
    />
{/if}
