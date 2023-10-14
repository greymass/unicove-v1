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

    import Number from './number.svelte'

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
            return `/send/${String($token.contract).toLowerCase()}/${String(
                $token.name
            ).toLowerCase()}`
        }
    })

    function fiatFormat(value: number, precision: number = 2) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: precision,
        }).format(value)
    }

    function toggle() {
        expanded = !expanded
    }
</script>

<style type="scss">
    .container {
        &:nth-child(even) {
            background: linear-gradient(
                90deg,
                rgba(248, 248, 248, 0) 0%,
                #f8f8f8 17.71%,
                #f8f8f8 80.73%,
                rgba(249, 249, 249, 0) 100%
            );
            :global(.darkmode) & {
                background: linear-gradient(
                    90deg,
                    rgba(17, 17, 17, 0) 0%,
                    #111111 17.71%,
                    #111111 80.73%,
                    rgba(17, 17, 17, 0) 100%
                );
            }
            .logo .wrapper {
                background: var(--main-white);
            }
        }

        &:hover {
            background: linear-gradient(
                90deg,
                rgba(102, 155, 188, 0) 0%,
                rgba(102, 155, 188, 0.1) 17.71%,
                rgba(102, 155, 188, 0.1) 80.73%,
                rgba(102, 155, 188, 0) 100%
            );
            :global(.darkmode) & {
                background: linear-gradient(
                    90deg,
                    rgba(153, 100, 67, 0) 0%,
                    rgba(153, 100, 67, 0.2) 17.71%,
                    rgba(153, 100, 67, 0.2) 80.73%,
                    rgba(153, 100, 67, 0) 100%
                );
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
                // background-color: var(--light-blue);
                .controls :global(.button) {
                    display: block;
                }
            }
            .logo {
                .wrapper {
                    background-color: var(--main-grey);
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                }
            }
            .price,
            .value {
                justify-content: flex-end;
            }

            .price,
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

    @media (hover: none) {
        .container .row .controls :global(.button) {
            display: block;
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
                    <TokenImage width="24" height="24" tokenKey={$token.key} />
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
            {#if balance.quantity}
                <Number asset={balance.quantity} />
            {/if}
            <div class="price">
                {#if $token.price}
                    {fiatFormat($token.price, 4)}
                {/if}
            </div>
            <div class="value">
                {#if $token.price}
                    {fiatFormat($token.price * balance.quantity.value, 2)}
                {/if}
            </div>
            <div class="controls">
                <div class="desktop">
                    {#if transferable}
                        <Button href={$url} style="secondary">
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
                <Button fluid href={$url} style="secondary">
                    <Icon name="arrow-up" />
                    <Text>Send</Text>
                </Button>
            {/if}
        </div>
    </div>
{/if}
