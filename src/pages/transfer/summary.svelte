<script lang="ts">
    import {Asset} from 'anchor-link'

    export let quantity
    export let txfee
    export let activeBlockchain

    console.log('summary')
    console.log({quantity})
    console.log({txfee})
    console.log({activeBlockchain})
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
        <td>{txfee}</td>
    </tr>
    <tr>
        <td>Total:</td>
        <td
            >{Asset.fromUnits(
                quantity.units.toNumber() + txfee.units.toNumber(),
                activeBlockchain.coreTokenSymbol
            )}</td
        >
    </tr>
</table>
