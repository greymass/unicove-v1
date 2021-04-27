<script lang="ts">
    import type {Name} from 'anchor-link'
    import Completed from '~/pages/transfer/status/template/completed.svelte'

    export let toAccount: Name
</script>

<style type="scss">
    span {
        line-height: 32px;
        vertical-align: middle;
    }
</style>

<Completed header="Account">
    <span>{toAccount}</span>
</Completed>
