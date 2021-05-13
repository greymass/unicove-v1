<script lang="ts">
    import type {Readable} from 'svelte/store'
    import type {Balance} from '~/stores/balances'
    import type {Token} from '~/stores/tokens'

    export let token: Token
    export let balance: Readable<Balance | undefined>
</script>

<style type="scss">
    .container {
        display: flex;
        min-height: 60px;
        padding: 10px 0;
    }

    .token {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background-color: var(--main-grey);
        padding: 6px;
        border-radius: 50%;
        vertical-align: middle;
        margin-right: 10px;
        img {
            height: 32px;
            width: 32px;
        }
    }

    .token:before {
        content: '';
        float: left;
        width: auto;
    }

    .balance .quantity {
        color: var(--main-black);
        font-family: Inter;
        font-style: normal;
        font-weight: bold;
        font-size: 18px;
        line-height: 28px;
        letter-spacing: -0.26px;
        vertical-align: middle;
    }
</style>

<div class="container">
    <div class="token">
        <img alt={String(token.name)} src={token.logo} />
    </div>
    {#if $balance}
        <div class="balance">
            <div class="quantity">{$balance.quantity}</div>
            <div>Available Balance ({$balance.account})</div>
        </div>
    {/if}
    <slot />
</div>
