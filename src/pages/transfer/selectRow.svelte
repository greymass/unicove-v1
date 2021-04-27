<script>
    import {router} from 'tinro'

    import type {Balance} from '~/stores/balances'
    import type {Token} from '~/stores/tokens'

    export let balance: Balance
    export let token: Token | undefined
</script>

<style type="scss">
    :global(.darkmode) tr {
        border-bottom: 1px solid var(--darkmode-grey);
        &:first-child {
            border-top: 1px solid var(--darkmode-grey);
        }
        &:hover {
            background-color: var(--darkmode-grey);
        }
    }
    tr {
        &:hover {
            background-color: var(--main-grey);
        }
        td {
            cursor: pointer;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            text-align: right;
            width: 120px;
            padding: 16px 8px;
            &:first-child {
                width: 64px;
                text-align: center;
                img {
                    width: 32px;
                    vertical-align: middle;
                }
            }
            &:nth-child(2) {
                text-align: left;
            }
        }
    }
</style>

{#if token}
    <tr
        on:click={() => {
            if (token) {
                router.goto(
                    `/transfer/${String(token.contract).toLowerCase()}/${String(
                        token.name
                    ).toLowerCase()}`
                )
            }
        }}
    >
        <td>
            <img alt={String(token.name)} src={token.logo} />
        </td>
        <td>
            {token.name}
        </td>
        <td>
            {balance.quantity.value}
        </td>
    </tr>
{/if}
