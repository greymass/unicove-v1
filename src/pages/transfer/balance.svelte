<script lang="ts">
    import type {Asset} from 'anchor-link'

    export let balance: Asset
</script>

<style type="scss">
</style>

<p>
    You have <i> {balance.toString()} </i>
</p>
