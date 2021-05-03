<script lang="ts">
    import type {Balance} from '~/stores/balances'
    import Completed from '~/pages/transfer/status/template/completed.svelte'

    export let balance: Balance
</script>

<style type="scss">
    span {
        line-height: 32px;
    }
</style>

<Completed header="Available Balance">
    <span>{balance.quantity}</span>
</Completed>
