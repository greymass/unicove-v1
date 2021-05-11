<script>
    import {Asset} from 'anchor-link'
    import {derived} from 'svelte/store'
    import type {Readable} from 'svelte/store'

    import {activeSession} from '~/store'
    import {createBalanceFromToken} from '~/stores/balances'
    import type {Balance} from '~/stores/balances'
    import {systemToken, systemTokenKey} from '~/stores/tokens'

    import TokenRow from '~/pages/tokens/row.svelte'

    export let balances: Readable<Balance[] | undefined>
    export let delegatedTokens: Readable<number>
    export let rexTokens: Readable<number>

    const records: Readable<Balance[] | undefined> = derived(
        [activeSession, balances, systemTokenKey],
        ([$activeSession, $balances, $systemTokenKey]) => {
            const results = []
            if ($activeSession && $balances) {
                results.push(
                    ...$balances.filter(
                        (b) =>
                            b.chainId.equals($activeSession.chainId) &&
                            b.account.equals($activeSession.auth.actor) &&
                            b.tokenKey !== $systemTokenKey
                    )
                )
            }
            return results
        }
    )

    const systemTokenBalance = derived(
        [activeSession, balances, systemTokenKey],
        ([$activeSession, $balances, $systemTokenKey]) => {
            if ($activeSession && $balances) {
                return $balances.find(
                    (b) =>
                        b.chainId.equals($activeSession.chainId) &&
                        b.account.equals($activeSession.auth.actor) &&
                        b.tokenKey === $systemTokenKey
                )
            }
        }
    )

    const rexBalance = derived(
        [activeSession, rexTokens, systemToken],
        ([$activeSession, $rexTokens, $systemToken]) => {
            if ($activeSession && $rexTokens && $systemToken) {
                const token = createBalanceFromToken(
                    $activeSession,
                    $systemToken,
                    Asset.from($rexTokens, $systemToken.symbol)
                )
                return token
            }
        }
    )

    const stakedBalance = derived(
        [activeSession, delegatedTokens, systemToken],
        ([$activeSession, $delegatedTokens, $systemToken]) => {
            if ($activeSession && $delegatedTokens && $systemToken) {
                const token = createBalanceFromToken(
                    $activeSession,
                    $systemToken,
                    Asset.from($delegatedTokens, $systemToken.symbol)
                )
                return token
            }
        }
    )
</script>

<style type="scss">
    table {
        margin-top: 1.5em;
        table-layout: fixed;
        width: 100%;
        white-space: nowrap;
        thead tr {
            th {
                font-weight: bold;
                white-space: nowrap;
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
        }
    }
    @media only screen and (max-width: 600px) {
        .mobile-hidden {
            display: none;
        }
    }
</style>

<table>
    <thead>
        <tr>
            <th />
            <th>Token</th>
            <th>Balance</th>
            <th class="mobile-hidden">Value</th>
            <th />
        </tr>
    </thead>
    <tbody>
        {#if $systemTokenBalance}
            <TokenRow balance={$systemTokenBalance} />
        {/if}
        {#if $stakedBalance && $systemToken}
            <TokenRow
                balance={$stakedBalance}
                name={`${$systemToken.name} (Staked)`}
                transferable={false}
            />
        {/if}
        {#if $rexBalance && $systemToken}
            <TokenRow
                balance={$rexBalance}
                name={`${$systemToken.name} (REX)`}
                transferable={false}
            />
        {/if}
        {#if $records}
            {#each $records as balance}
                <TokenRow {balance} />
            {/each}
        {/if}
    </tbody>
</table>
