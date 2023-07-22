<script lang="ts">
    import {Asset} from '@greymass/eosio'
    import {getAddress} from 'ethers/lib/utils'
    import Button from '~/components/elements/button.svelte'

    import {evmAccount, activeSession} from '~/store'

    export let from: string
    export let to: string
    export let amount: string
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
        border: 2px solid var(--main-grey);

        .top-section {
            margin-bottom: 2em;
        }

        table {
            width: 100%;
            margin-bottom: 2em;

            tr {
                display: flex;
                justify-content: space-between;
                font-size: 11px;
                border-top: 1px solid #ddd;

                &:first-child {
                    border: none;
                }

                td {
                    padding: 1.5em;
                }
            }
        }

        .bottom-section {
            max-width: 300px;
            margin: auto;
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
            <td>From {from}</td>
            <td>{from === 'EVM' ? $evmAccount?.address : $activeSession?.auth.actor}</td>
        </tr>
        <tr>
            <td>To {to}</td>
            <td>{from === 'Native' ? $evmAccount?.address : $activeSession?.auth.actor}</td>
        </tr>
        <tr>
            <td>Amount</td>
            <td>{Asset.from(Number(amount), '4,EOS')}</td>
        </tr>
    </table>
    <div class="bottom-section">
        <Button fluid style="primary" on:action={handleConfirm}>Sign Transaction</Button>
        <br />
        <Button fluid on:action={handleBack}>Cancel</Button>
    </div>
</div>
