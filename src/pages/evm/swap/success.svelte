<script lang="ts">
    import TxFollower from '~/components/tx-follower/index.svelte'
    import Button from '~/components/elements/button.svelte'
    import type {TransactResult} from 'anchor-link'
    import type {ethers} from 'ethers'

    import {activeBlockchain} from '~/store'

    export let transferOption: string
    export let nativeTransactResult: TransactResult | undefined
    export let evmTransactResult: ethers.providers.TransactionResponse | undefined
    export let handleBack: () => void
</script>

<style>
    .container {
        font-family: Arial, sans-serif;
        max-width: 500px;
        margin: auto;
        padding: 3em;
        background-color: transparent;
        text-align: center;
    }

    .top-section {
        margin-bottom: 2em;
    }

    table {
        width: 100%;
        margin-bottom: 2em;
    }

    table td {
        padding: 1em;
        border-bottom: 1px solid #ddd;
    }

    table tr:first-child td {
        border-top: 1px solid #ddd;
    }
</style>

{#if nativeTransactResult}
    <TxFollower id={nativeTransactResult.payload.tx} chain={$activeBlockchain} />
{:else}
    <div class="container">
        <div class="top-section">
            <h1>Transfer Sent</h1>
        </div>

        <table>
            <tr>
                <td>Transaction ID</td>
                <td>{evmTransactResult?.hash}</td>
            </tr>
            <tr>
                <td>
                    <Button style="primary" on:action={handleBack}>New Transfer</Button>
                </td>
                <td>
                    <Button>View on Block Explorer</Button>
                </td>
            </tr>
        </table>
    </div>
{/if}
