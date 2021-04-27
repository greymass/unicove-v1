<script>
    import {derived} from 'svelte/store'
    import type {Readable} from 'svelte/store'

    import {activeSession} from '~/store'
    import type {Balance, BalancesStore} from '~/stores/balances'

    import TokenRow from '~/pages/tokens/row.svelte'

    export let balances: Readable<BalancesStore | undefined>

    const records: Readable<Balance[] | undefined> = derived(
        [activeSession, balances],
        ([$activeSession, $balances]) => {
            if ($activeSession && $balances) {
                return $balances.records.filter(
                    (b) =>
                        b.chainId.equals($activeSession.chainId) &&
                        b.account.equals($activeSession.auth.actor)
                )
            }
        }
    )
</script>

<style type="scss">
    table {
        table-layout: fixed;
        width: 100%;
        white-space: nowrap;
        thead tr {
            th {
                white-space: nowrap;
                // overflow: hidden;
                // text-overflow: ellipsis;
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
        {#if $records}
            {#each $records as balance}
                <TokenRow {balance} />
            {/each}
        {/if}
    </tbody>
</table>
