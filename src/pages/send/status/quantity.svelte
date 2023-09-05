<script lang="ts">
    import type {Asset} from 'anchor-link'

    import type {Token} from '~/stores/tokens'
    import TokenImage from '~/components/elements/image/token.svelte'
    import Completed from '~/pages/send/status/template/completed.svelte'
    import {transferData, Step} from '../transfer'

    export let quantity: Asset
    export let editable: boolean = false
    export let token: Token
    let usd: string | null = token.price ? (Number(quantity.value) * token.price).toFixed(2) : null

    function changeAmount() {
        transferData.update((data) => ({
            ...data,
            step: Step.Amount,
            backStep: data.step,
        }))
    }

    const changeStep = editable ? changeAmount : undefined
</script>

<style type="scss">
    .quantity {
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }

    .logo-container {
        display: flex;
        margin-right: 10px;
    }

    .value {
        padding-top: 8px;
        font-weight: 550;
        font-size: 10px;
        line-height: 12px;
        letter-spacing: 0.1px;
        text-transform: uppercase;
        color: var(--light-grey);
    }
</style>

<Completed header="Token Quantity" {changeStep}>
    <div class="quantity">
        <span class="logo-container">
            <TokenImage width="18" height="18" tokenKey={token.key} />
        </span>
        <span>{quantity}</span>
    </div>
    {#if usd}
        <div class="value">≈ $ {usd} USD</div>
    {/if}
</Completed>
