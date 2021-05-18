<script lang="ts">
    import type {Readable} from 'svelte/store'
    import {derived} from 'svelte/store'
    import type {Balance} from '~/stores/balances'
    import type {Token} from '~/stores/tokens'
    import {tokens} from '~/stores/tokens'

    import Button from '~/components/elements/button.svelte'
    import Icon from '~/components/elements/icon.svelte'

    export let balance: Balance
    export let name: string = ''
    export let transferable: boolean = true

    let token: Readable<Token | undefined> = derived([tokens], ([$tokens]) => {
        if (balance && $tokens) {
            return $tokens.find((t) => t.key === balance.tokenKey)
        }
    })

    const url = derived(token, ($token) => {
        if ($token) {
            return `/transfer/${String($token.contract).toLowerCase()}/${String(
                $token.name
            ).toLowerCase()}`
        }
    })

    function fiatFormat(value: number) {
        const fiatSymbol = '$'
        const fiatName = 'USD'
        return `${fiatSymbol}${value.toFixed(4)} ${fiatName}`
    }
</script>

<style type="scss">
    .container {
        &:nth-child(even) {
            background: var(--main-grey);
            .logo {
                background: var(--main-white);
            }
        }
        display: flex;
        min-height: 60px;
        max-height: 84px;
        padding: 12px;
    }

    .logo {
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

    .logo:before {
        content: '';
        float: left;
        width: auto;
    }

    .token .name {
        color: var(--main-black);
        font-family: Inter;
        font-style: normal;
        font-weight: bold;
        font-size: 18px;
        line-height: 28px;
        letter-spacing: -0.26px;
        vertical-align: middle;
        white-space: nowrap;
    }

    .controls {
        min-width: 44px;
        line-height: 44px;
        padding-left: 1em;
    }
    .price {
        margin-left: auto;
        text-align: right;
        .value {
            color: var(--main-black);
            font-family: Inter;
            font-style: normal;
            font-size: 16px;
            line-height: 44px;
            letter-spacing: -0.26px;
            vertical-align: middle;
        }
    }

    @media only screen and (max-width: 600px) {
        .token .name {
            font-size: 16px;
        }
        .price .value {
            font-size: 12px;
        }
        .controls {
            display: none;
        }
    }
</style>

{#if $token && balance}
    <div class="container">
        <a href={transferable ? $url : undefined} class="logo">
            <img alt={String($token.name)} src={$token.logo} />
        </a>
        <div class="token">
            <a href={transferable ? $url : undefined} class="name">
                {#if name}
                    {name}
                {:else if $token}
                    {$token.name}
                {:else}
                    {balance.quantity.symbol.name}
                {/if}
            </a>
            <div class="quantity">{balance.quantity}</div>
        </div>
        <div class="price">
            {#if $token.price}
                <div class="value">{fiatFormat($token.price * balance.quantity.value)}</div>
            {/if}
        </div>
        <div class="controls">
            {#if transferable}
                <Button href={$url} primary>
                    <Icon name="send" />
                </Button>
            {/if}
        </div>
    </div>
{/if}
