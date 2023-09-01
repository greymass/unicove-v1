<script lang="ts">
    import type {Asset} from '@greymass/eosio'
    import Button from '~/components/elements/button.svelte'

    import {evmAccount, activeSession} from '~/store'
    import type {Token} from '~/stores/tokens'

    export let from: Token
    export let to: Token
    export let depositAmount: Asset
    export let receivedAmount: Asset
    export let feeAmount: Asset | undefined
    export let handleConfirm: () => void
    export let handleBack: () => void
</script>

<style type="scss">
    .container {
        width: 100%;
        margin: auto;
        padding: 3em;
        background-color: transparent;
        text-align: center;
        border: 1px solid #ddd;
        border-radius: 30px;

        .top-section {
            margin-bottom: 2em;

            h1 {
                font-weight: bold;
                font-size: 1.8em;
            }

            h3 {
                margin-top: 10px;
                font-weight: normal;
                font-size: 1.5em;
            }
        }

        table {
            width: 100%;
            margin-bottom: 2em;

            tr {
                display: flex;
                justify-content: space-between;
                font-size: 11px;
                border-top: 1px solid #ddd;
                padding: 10px;

                &:first-child {
                    border: none;
                }

                td {
                    padding: 1.5em;

                    &:first-of-type {
                        font-weight: bold;
                    }
                }
            }
        }

        .bottom-section {
            max-width: 300px;
            margin: auto;
        }

        /* Media Query for Mobile */
        @media screen and (max-width: 768px) {
            padding: 1em;

            table {
                tr {
                    flex-direction: column;
                    align-items: start;
                }
            }

            .bottom-section {
                max-width: 100%;
            }
        }
    }
</style>

<div class="container">
    <div class="top-section">
        <h1>Transfer</h1>
        <h3>Review and Sign</h3>
    </div>

    <table>
        <tr>
            <td>From {from.name}</td>
            <td>{from?.name === 'EOS (EVM)' ? $evmAccount?.address : $activeSession?.auth.actor}</td
            >
        </tr>
        <tr>
            <td>To {to.name}</td>
            <td>{from?.name === 'EOS' ? $evmAccount?.address : $activeSession?.auth.actor}</td>
        </tr>
        <tr>
            <td>Deposit Amount</td>
            <td>{depositAmount}</td>
        </tr>
        <tr>
            <td>Fee Amount</td>
            <td>{feeAmount || '0.0000 EOS'}</td>
        </tr>
        <tr>
            <td>Received Amount</td>
            <td>{receivedAmount}</td>
        </tr>
    </table>
    <div class="bottom-section">
        <Button fluid style="primary" on:action={handleConfirm}>Sign Transaction</Button>
        <br />
        <Button fluid on:action={handleBack}>Cancel</Button>
    </div>
</div>
