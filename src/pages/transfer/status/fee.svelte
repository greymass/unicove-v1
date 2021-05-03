<script lang="ts">
    import {Asset} from 'anchor-link'

    import {activeBlockchain} from '~/store'
    import Completed from '~/pages/transfer/status/template/completed.svelte'

    export let txFee: Asset | undefined = undefined
    export let quantity: Asset | undefined = undefined

    let total: Asset | undefined = undefined

    $: {
        total =
            quantity &&
            txFee &&
            Asset.fromUnits(
                quantity.units.toNumber() + txFee.units.toNumber(),
                $activeBlockchain.coreTokenSymbol
            )
    }
</script>

<style type="scss">
    span {
        line-height: 32px;
        vertical-align: middle;
    }
</style>

<Completed header="Network Fee">
    <span>{txFee}</span>
</Completed>

<Completed header="Total">
    <span>{total}</span>
</Completed>
