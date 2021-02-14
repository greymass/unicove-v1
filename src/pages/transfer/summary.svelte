<script lang="ts">
    import {Asset} from 'anchor-link'
    import type {ChainConfig} from '~/config'

    export let quantity: Asset
    export let txFee: Asset
    export let activeBlockchain: ChainConfig
</script>

<style type="scss">
    table {
        margin: 20px 0;

        td {
            padding: 5px;
        }
    }

    @media only screen and (max-width: 600px) {
        table {
            margin: 20px auto;
        }
    }
</style>

<table>
    <tr>
        <td>Sending:</td>
        <td>{quantity}</td>
    </tr>
    <tr>
        <td>Fee:</td>
        <td>{txFee}</td>
    </tr>
    <tr>
        <td>Total:</td>
        <td
            >{Asset.fromUnits(
                quantity.units.toNumber() + txFee.units.toNumber(),
                activeBlockchain.coreTokenSymbol
            )}</td
        >
    </tr>
</table>
