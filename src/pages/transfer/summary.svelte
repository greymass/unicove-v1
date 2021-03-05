<script lang="ts">
    import {Asset} from 'anchor-link'

    import {activeBlockchain} from '~/store'
    import {quantity} from './transferData'

    export let txFee: Asset | undefined = undefined

    let total: Asset | undefined = undefined

    $: {
      total = $quantity && txFee && Asset.fromUnits(
          $quantity.units.toNumber() + txFee.units.toNumber(),
          $activeBlockchain.coreTokenSymbol
      )
    }
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
        <td>{$quantity}</td>
    </tr>
    <tr>
        <td>Fee:</td>
        <td>{txFee}</td>
    </tr>
    <tr>
        <td>Total:</td>
        <td>{total}</td>
    </tr>
</table>
