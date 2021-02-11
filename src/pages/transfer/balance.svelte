<script lang="ts">
    import {Asset} from 'anchor-link'

    export let balance
    export let activeBlockchain
</script>

<style type="scss">
</style>

<p>
    You have <i
        on:click={() => {
            value = String(balance.value)
            quantity = Asset.fromUnits(value, activeBlockchain.coreTokenSymbol)
        }}> {balance} </i>
</p>
