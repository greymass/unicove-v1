<script lang="ts">
    import type {Readable} from 'svelte/store'
    import type {Balance} from '~/stores/balances'
    import Completed from '~/pages/transfer/status/template/completed.svelte'

    export let balance: Readable<Balance | undefined>
</script>

<style type="scss">
    span {
        line-height: 32px;
    }
</style>

<Completed header="Available Balance">
    {#if $balance}
        <span>{$balance.quantity}</span>
    {:else}
        <span>Unknown</span>
    {/if}
</Completed>
