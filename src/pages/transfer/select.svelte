<script>
    import {derived, writable} from 'svelte/store'
    import type {Readable, Writable} from 'svelte/store'

    import {activeSession, currentAccount} from '~/store'
    import {balances} from '~/stores/balances'
    import {tokens} from '~/stores/tokens'
    import type {Balance} from '~/stores/balances'
    import type {Token} from '~/stores/tokens'

    import Page from '~/components/layout/page.svelte'
    import Row from './select-row.svelte'
    import Input from '~/components/elements/input.svelte'

    let query: Writable<string> = writable('')

    interface Record {
        balance: Balance
        token?: Token
    }

    const matching: Readable<Balance[] | undefined> = derived(
        [activeSession, balances, currentAccount, query],
        ([$activeSession, $balances, $currentAccount, $query]) => {
            if ($activeSession && $balances && $currentAccount) {
                return $balances.filter((b) => {
                    const matchesChain = b.chainId.equals($activeSession.chainId)
                    const matchesAccount = b.account.equals($activeSession.auth.actor)
                    let matchesQuery = true
                    if ($query) {
                        const [, , token] = b.tokenKey.split('-')
                        matchesQuery = token.includes($query)
                    }
                    return matchesChain && matchesAccount && matchesQuery
                })
            }
        }
    )

    const records: Readable<Record[]> = derived([matching, tokens], ([$matching, $tokens]) => {
        if ($matching) {
            return $matching.map((balance) => {
                const token = $tokens.find((t) => t.key === balance.tokenKey)
                const record: Record = {
                    balance,
                    token,
                }
                return record
            })
        }
        return []
    })

    function updateQuery({detail}: {detail: any}) {
        query.set(detail.value)
    }
</script>

<style type="scss">
    .container {
        table {
            margin-top: 30px;
            table-layout: fixed;
            width: 100%;
            white-space: nowrap;
        }
    }
</style>

<Page title="Transfer Tokens" subtitle="Select a token to transfer">
    <div class="container">
        <Input on:changed={updateQuery} name="query" focus fluid placeholder="Search tokens..." />
        <table>
            <tbody>
                {#if $records}
                    {#each $records as record}
                        <Row token={record.token} balance={record.balance} />
                    {/each}
                {/if}
            </tbody>
        </table>
    </div>
</Page>
