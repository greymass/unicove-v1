<script lang="ts">
    import type {Asset} from 'anchor-link'
    import Completed from '~/pages/transfer/status/template/completed.svelte'

    export let quantity: Asset
</script>

<style type="scss">
    span {
        line-height: 32px;
        vertical-align: middle;
    }
</style>

<Completed header="Quantity">
    <span>{quantity}</span>
</Completed>
