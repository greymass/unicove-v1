<script lang="ts">
    import TxFollower from '~/components/tx-follower/index.svelte'
    import EvmTxFollower from '~/components/evm-tx-follower/index.svelte'
    import type {TransactResult} from 'anchor-link'
    import type {ethers} from 'ethers'

    import {activeBlockchain} from '~/store'

    export let transactResult: TransactResult | ethers.providers.TransactionResponse
    export let handleBack: () => void
</script>

{#if "payload" in transactResult}
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
