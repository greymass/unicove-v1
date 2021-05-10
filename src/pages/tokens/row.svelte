<script>
    import {derived} from 'svelte/store'
    import type {Readable} from 'svelte/store'

    import {tokens} from '~/stores/tokens'
    import type {Balance} from '~/stores/balances'
    import type {Token} from '~/stores/tokens'

    import Button from '~/components/elements/button.svelte'
    import Icon from '~/components/elements/icon.svelte'

    export let balance: Balance
    export let name: string = ''
    export let transferable: boolean = true

    let token: Readable<Token | undefined> = derived([tokens], ([$tokens]) =>
        $tokens.find((t) => t.key === balance.tokenKey)
    )

    function fiatFormat(value: number) {
        const fiatSymbol = '$'
        const fiatName = 'USD'
        return `${fiatSymbol}${value.toFixed(4)} ${fiatName}`
    }
</script>

<style type="scss">
    tr {
        td {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            text-overflow: clip;
            text-align: right;
            &:first-child,
            &:last-child {
                text-align: center;
                width: 64px;
            }
            &:nth-child(2) {
                text-align: left;
            }
        }
        td {
            width: 120px;
            padding: 24px 0;
            border-bottom: 1px solid var(--divider-grey);
            &:first-child {
                border: none;
                padding: 0 15px;
                img {
                    width: 32px;
                    vertical-align: middle;
                }
            }
            &:last-child {
                width: 64px;
            }
        }
    }

    @media only screen and (max-width: 600px) {
        .mobile-hidden {
            display: none;
        }
    }
</style>

<tr>
    <td>
        {#if $token}
            <img alt={String($token.name)} src={$token.logo} />
        {/if}
    </td>
    <td>
        {#if name}
            {name}
        {:else if $token}
            {$token.name}
        {:else}
            {balance.quantity.symbol.name}
        {/if}
    </td>
    <td>
        {String(balance.quantity).split(' ')[0]}
    </td>
    <td class="mobile-hidden">
        {#if $token && $token.price}
            <p>{fiatFormat($token.price * balance.quantity.value)}</p>
            <p>{fiatFormat($token.price)}/{balance.quantity.symbol.name}</p>
        {/if}
    </td>
    <td>
        {#if $token && transferable}
            <Button
                href={`/transfer/${String($token.contract).toLowerCase()}/${String(
                    $token.name
                ).toLowerCase()}`}
            >
                <Icon name="send" />
            </Button>
        {/if}
    </td>
</tr>
