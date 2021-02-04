<script>
    export let quantity
    export let txFee
    export let activeBlockchain
</script>

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
