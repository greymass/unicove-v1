<script lang="ts">
    import type {Readable} from 'svelte/store'
    import {derived} from 'svelte/store'
    import type {Balance} from '~/stores/balances'
    import type {Token} from '~/stores/tokens'
    import {tokens} from '~/stores/tokens'

    import Button from '~/components/elements/button.svelte'
    import Icon from '~/components/elements/icon.svelte'
    import Text from '~/components/elements/text.svelte'
    import TokenImage from '~/components/elements/image/token.svelte'

    export let balance: Balance
    export let name: string = ''
    export let transferable: boolean = true

    let expanded = false

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
        return `${fiatSymbol}${value.toFixed(4)}`
    }

    function toggle() {
        expanded = !expanded
    }
</script>

<style type="scss">
    .container {
        &:nth-child(odd) {
            background: var(--main-grey);
            .logo .wrapper {
                background: var(--main-white);
            }
        }
        .row {
            display: flex;
            min-height: 60px;
            max-height: 84px;
            padding: 12px;
            > * {
                display: inline-flex;
                align-items: center;
                margin-right: 10px;
                flex: 1;
            }
            > :nth-child(1) {
                flex: 0;
            }
            > :last-child {
                flex: 0;
            }
            &:hover {
                .controls :global(.button) {
                    display: block;
                }
            }

            .logo {
                .wrapper {
                    background-color: var(--main-grey);
                    padding: 3px;
                    border-radius: 50%;
                    :global(img) {
                        height: 18px;
                        width: 18px;
                    }
                    &:before {
                        content: '';
                        float: left;
                        width: auto;
                    }
                }
            }

            .price,
            .quantity,
            .value {
                justify-content: flex-end;
            }

            .price,
            .quantity,
            .token,
            .value {
                font-family: Inter;
                font-style: normal;
                font-weight: 500;
                font-size: 13px;
                line-height: 300%;

                display: flex;
                align-items: center;
                letter-spacing: -0.04px;
            }

            .controls {
                min-width: 90px;
                padding-left: 1em;
                :global(.button) {
                    display: none;
                }
                .mobile {
                    display: none;
                    :global(.icon) {
                        color: var(--dark-grey);
                    }
                }
            }
        }
        .extra {
            display: none;
            .values {
                padding: 0 12px;
                display: flex;
                > * {
                    flex-grow: 1;
                }
                .label {
                    font-family: Inter;
                    font-style: normal;
                    font-weight: 600;
                    font-size: 10px;
                    line-height: 12px;
                    letter-spacing: 0.1px;
                    text-transform: uppercase;
                    color: var(--dark-grey);
                }
                .amount {
                    font-family: Inter;
                    font-style: normal;
                    font-weight: 500;
                    font-size: 13px;
                    line-height: 300%;
                    display: flex;
                    align-items: center;
                    letter-spacing: -0.04px;
                    color: var(--main-black);
                }
            }
        }
    }

    @media only screen and (max-width: 600px) {
        .container {
            .row {
                .controls {
                    min-width: auto;
                    padding: 0;
                    margin: 0;
                    .desktop {
                        display: none;
                    }
                    .mobile {
                        display: block;
                    }
                }
                .value,
                .price {
                    display: none;
                }
            }
            .extra {
                :global(.button) {
                    margin: 9px;
                }
            }
            &.expanded .extra {
                display: block;
            }
        }
    }
</style>

{#if $token && balance}
    <div class="container" class:expanded>
        <div class="row" on:click={toggle}>
            <div class="logo">
                <div class="wrapper">
                    <TokenImage tokenKey={$token.key} />
                </div>
            </div>
            <div class="token">
                <span class="name">
                    {#if name}
                        {name}
                    {:else if $token}
                        {$token.name}
                    {:else}
                        {balance.quantity.symbol.name}
                    {/if}
                </span>
            </div>
            <div class="quantity">{balance.quantity.value}</div>
            <div class="value">
                {#if $token.price}
                    {fiatFormat($token.price * balance.quantity.value)}
                {/if}
            </div>
            <div class="price">
                {#if $token.price}
                    {fiatFormat($token.price)}
                {/if}
            </div>
            <div class="controls">
                <div class="desktop">
                    {#if transferable}
                        <Button href={$url} primary>
                            <Icon name="arrow-up" />
                            <Text>Send</Text>
                        </Button>
                    {/if}
                </div>
                <div class="mobile">
                    <Icon name={expanded ? 'chevron-down' : 'chevron-right'} />
                </div>
            </div>
        </div>
        <div class="extra">
            <div class="values">
                {#if $token.price}
                    <div class="value">
                        <div class="label">Value</div>
                        <div class="amount">
                            {fiatFormat($token.price * balance.quantity.value)}
                        </div>
                    </div>
                    <div class="price">
                        <div class="label">Price</div>
                        <div class="amount">{fiatFormat($token.price)}</div>
                    </div>
                {/if}
            </div>
            {#if transferable}
                <Button fluid href={$url} primary>
                    <Icon name="arrow-up" />
                    <Text>Send</Text>
                </Button>
            {/if}
        </div>
    </div>
{/if}
