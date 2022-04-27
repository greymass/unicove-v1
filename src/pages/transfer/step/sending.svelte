<script lang="ts">
    import {activeBlockchain} from '~/store'
    import {transferData} from '~/pages/transfer/transfer'
    import type {Token} from '~/stores/tokens'

    import {txFee} from '~/pages/transfer/fio'
    import StatusAddress from '~/pages/transfer/status/address.svelte'
    import StatusAccount from '~/pages/transfer/status/account.svelte'
    import StatusQuantity from '~/pages/transfer/status/quantity.svelte'
    import StatusMemo from '~/pages/transfer/status/memo.svelte'
    import StatusFee from '~/pages/transfer/status/fee.svelte'

    export let token: Token
</script>

<style type="scss">
    .container {
        margin-top: 1em;
    }
</style>

<div class="container">
    {#if $transferData.toAddress}
        <StatusAddress toAddress={$transferData.toAddress} />
    {/if}
    {#if $transferData.toAccount}
        <StatusAccount toAccount={$transferData.toAccount} />
    {/if}
    {#if $transferData.quantity}
        <StatusQuantity quantity={$transferData.quantity} {token} />
    {/if}
    {#if $transferData.quantity && $txFee}
        <StatusFee txFee={$txFee} quantity={$transferData.quantity} />
    {/if}
    {#if $activeBlockchain && $activeBlockchain.id !== 'fio'}
        <StatusMemo memo={$transferData.memo} />
    {/if}
</div>
