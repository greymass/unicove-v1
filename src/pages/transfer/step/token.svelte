<script>
    import {derived, writable} from 'svelte/store'
    import type {Readable, Writable} from 'svelte/store'

    import {activeSession, currentAccount} from '~/store'
    import {balances} from '~/stores/balances'
    import {tokens} from '~/stores/tokens'
    import type {Balance} from '~/stores/balances'
    import type {Token} from '~/stores/tokens'
    import {Step, transferData} from '~/pages/transfer/transfer'
    import Form from '~/components/elements/form.svelte'
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

    function changeToken(token: Token) {
        transferData.update((data) => ({
            ...data,
            step: data.backStep || Step.Recipient,
            backStep: undefined,
            quantity: undefined,
            tokenKey: token.key,
        }))
    }
</script>

<style type="scss">
    .container {
        table {
            margin-top: 30px;
            table-layout: fixed;
            width: 100%;
            white-space: nowrap;
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
        }
    }
</style>

<div class="container">
    <Form>
        <Input on:changed={updateQuery} name="query" focus fluid placeholder="Search tokens..." />
    </Form>
    <table>
        <tbody>
            {#if $records}
                {#each $records as record}
                    {#if record.token}
                        <tr
                            on:click={() => {
                                if (record.token) {
                                    changeToken(record.token)
                                }
                            }}
                        >
                            <td>
                                <img alt={String(record.token.name)} src={record.token.logo} />
                            </td>
                            <td>
                                {record.token.name}
                            </td>
                            <td>
                                {record.balance.quantity.value}
                            </td>
                        </tr>
                    {/if}
                {/each}
            {/if}
        </tbody>
    </table>
</div>
