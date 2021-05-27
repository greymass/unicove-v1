<script>
    import {derived, writable} from 'svelte/store'
    import type {Readable, Writable} from 'svelte/store'

    import Form from '~/components/elements/form.svelte'
    import Input from '~/components/elements/input.svelte'
    import Modal from '~/components/elements/modal.svelte'
    import Icon from '~/components/elements/icon.svelte'
    import TokenSelectorRow from './selector/row.svelte'

    export let tokens;
    export let defaultToken;

    let selectedToken = defaultToken;
    let displayModal = writable<boolean>(false)
    let query: string = ''

    // const matching: Readable<Balance[] | undefined> = derived(
    //     [activeSession, balances, currentAccount, query],
    //     ([$activeSession, $balances, $currentAccount, $query]) => {
    //         if ($activeSession && $balances && $currentAccount) {
    //             return $balances.filter((b) => {
    //                 const matchesChain = b.chainId.equals($activeSession.chainId)
    //                 const matchesAccount = b.account.equals($activeSession.auth.actor)
    //                 let matchesQuery = true
    //                 if ($query) {
    //                     const [, , token] = b.tokenKey.split('-')
    //                     matchesQuery = token.includes($query)
    //                 }
    //                 return matchesChain && matchesAccount && matchesQuery
    //             })
    //         }
    //     }
    // )
    //
    // const records: Readable<Record[]> = derived([matching, tokens], ([$matching, $tokens]) => {
    //     if ($matching) {
    //         return $matching.map((balance) => {
    //             const token = $tokens.find((t) => t.key === balance.tokenKey)
    //             const record: Record = {
    //                 balance,
    //                 token,
    //             }
    //             return record
    //         })
    //     }
    //     return []
    // })

    function updateQuery(value) : string {
      console.log({value})
      query.set(value)
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
    table {
        margin-top: 16px;
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
                width: 80px;
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
                &:last-child {
                  width: 30px;
                  padding: 20px;

                }
            }
        }
    }
</style>

<Modal display={displayModal} hideCloseButton>
    <Form>
        <Input on:changed={updateQuery} name="query" focus fluid placeholder="Search tokens..." />
    </Form>
    <table>
        <th>
          <tc> Token </tc>
          <tc> Balance </tc>
        </th>

        {#each tokens as token}
          <tr>
            <TokenSelectorRow
              onClick={() => changeToken(token)}
              token={token}
            />
          </tr>
        {/each}
    </table>
</Modal>

<TokenSelectorRow
  onClick={() => $displayModal = true}
  token={selectedToken}
/>
