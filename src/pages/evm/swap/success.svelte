<script lang="ts">
    import Summary from "~/components/tx-follower/summary.svelte"
    import Button from "~/components/elements/button.svelte"
    import type { TransactResult } from "anchor-link"
    import type { ethers } from "ethers";

    export let transferOption: string
    export let transactResult: TransactResult | ethers.providers.TransactionResponse
</script>


{#if transferOption === 'nativeToEvm'}
    <Summary
        txId={transactResult.confirmation.id}
    />
{:else}
<div class="container">
    <div class="top-section">
        <h1>Transfer Sent</h1>
    </div>

    <table>
        <tr>
            <td>Transaction ID</td>
            <td>{transactResult.confirmation.id}</td>
        </tr>
        <tr>
            <Button>
                New Transfer
            </Button>
            <Button>
                View on Block Explorer
            </Button>
        </tr>
    </table>
</div>
{/if}
