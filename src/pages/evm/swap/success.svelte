<script lang="ts">
    import TxFollower from '~/components/tx-follower/index.svelte'
    import Button from '~/components/elements/button.svelte'
    import type {TransactResult} from 'anchor-link'
    import type {ethers} from 'ethers'

    import {activeBlockchain} from '~/store'
    import type { Token } from '~/stores/tokens'

    export let from: Token
    export let to: Token
    export let nativeTransactResult: TransactResult | undefined
    export let evmTransactResult: ethers.providers.TransactionResponse | undefined
    export let handleBack: () => void

    const blockExplorerUrl = 'https://explorer.evm.eosnetwork.com/tx/'
</script>

<style type="scss">
    .container {
        width: 100%;
        font-family: Arial, sans-serif;
        margin: auto;
        padding: 3em;
        background-color: transparent;
        text-align: center;

        .top-section {
            margin-bottom: 2em;
        }

        table {
            width: 100%;
            margin-bottom: 2em;

            tr:first-child td {
                border-top: 1px solid #ddd;
            }

            tr td {
                padding: 1em;
                border-bottom: 1px solid #ddd;
            }
        }

        .bottom-section {
            display: flex;
            justify-content: center;
            gap: 1em;
        }

         /* Media Query for Mobile */
        @media screen and (max-width: 768px) {
            padding: 1em;

            table {
                width: 300px;
                margin: auto;

                tr:first-child td {
                    border: none;
                }

                tr {
                    display: flex;
                    flex-direction: column;
                }

                tr td {
                    border: none;
                    word-wrap: break-word;
                    width: 300px;
                }

                tr td:last-child {
                    padding-top: 0;
                    margin-bottom: 20px;
                }
            }

            .bottom-section {
                flex-direction: column;
                align-items: center;
            }
        }
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
                <td>Transaction ID:</td>
                <td>{evmTransactResult?.hash}</td>
            </tr>
        </table>

        <div class="bottom-section">
            <Button style="primary" on:action={handleBack}>New Transfer</Button>
            <Button on:action={() => window.open(`${blockExplorerUrl}${evmTransactResult?.hash}`)}
                >View on Block Explorer</Button
            >
        </div>
    </div>
{/if}
