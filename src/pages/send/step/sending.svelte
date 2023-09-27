<script lang="ts">
    import {activeBlockchain} from '~/store'
    import {transferData} from '~/pages/send/transfer'
    import type {Token} from '~/stores/tokens'

    import {txFee} from '~/pages/send/fio'
    import StatusAddress from '~/pages/send/status/address.svelte'
    import StatusAccount from '~/pages/send/status/account.svelte'
    import StatusQuantity from '~/pages/send/status/quantity.svelte'
    import StatusMemo from '~/pages/send/status/memo.svelte'
    import StatusFee from '~/pages/send/status/fee.svelte'

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
