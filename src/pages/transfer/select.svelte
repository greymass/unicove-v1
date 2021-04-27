<script>
    import {derived} from 'svelte/store'
    import type {Readable} from 'svelte/store'

    import {activeSession, currentAccount} from '~/store'
    import {balances} from '~/stores/balances'
    import type {Balance} from '~/stores/balances'

    import Page from '~/components/layout/page.svelte'
    import Row from '~/pages/transfer/selectRow.svelte'

    const records: Readable<Balance[] | undefined> = derived(
        [activeSession, balances, currentAccount],
        ([$activeSession, $balances, $currentAccount]) => {
            if ($activeSession && $balances && $currentAccount) {
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
    .container {
        table {
            table-layout: fixed;
            width: 100%;
            white-space: nowrap;
            tr {
                th {
                    cursor: pointer;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    text-align: right;
                    font-family: Inter;
                    font-style: normal;
                    font-weight: 600;
                    font-size: 12px;
                    line-height: 2em;
                    letter-spacing: 0.1px;
                    text-transform: uppercase;
                    color: var(--dark-grey);
                    &:first-child {
                        width: 64px;
                        text-align: center;
                    }
                    &:nth-child(2) {
                        text-align: left;
                    }
                }
            }
        }
    }
</style>

<Page title="Transfer Tokens" subtitle="Select a token to transfer">
    <div class="container">
        <table>
            <thead>
                <tr>
                    <th />
                    <th>Token</th>
                    <th>Quantity</th>
                </tr>
            </thead>
            <tbody>
                {#if $records}
                    {#each $records as balance}
                        <Row {balance} />
                    {/each}
                {/if}
            </tbody>
        </table>
    </div>
</Page>
