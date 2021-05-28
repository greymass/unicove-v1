<script>
    import {derived, writable} from 'svelte/store'
    import type {Readable, Writable} from 'svelte/store'

    import Form from '~/components/elements/form.svelte'
    import Input from '~/components/elements/input.svelte'
    import Modal from '~/components/elements/modal.svelte'

    import TokenSelectorRow from './selector/row.svelte'

    export let tokens;
    export let defaultToken;

    let selectedToken = defaultToken;
    let displayModal = writable<boolean>(true)
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

    function updateQuery({ detail }) : string {
      console.log('updateQuery', {value: detail.value})
      query = detail.value
    }

    function changeToken(token: Token) {
      selectedToken(token)

      onTokenSelect(token)
    }

    let filteredTokens = []

    $: {
        filteredTokens = tokens.filter(token => {
          console.log({query})
          console.log({token})
          return query.length === 0 || token.name.toLowerCase().includes(query.toLowerCase())
        })
    }
</script>

<style type="scss">
    h2 {
      text-align: left;
      margin: 10px 3px;
    }

    table {
        margin-top: 10px;
        table-layout: fixed;
        width: 100%;
        white-space: nowrap;

        th {
          text-align: left;
          color: var(--dark-grey);
          font-family: Inter;
          font-style: normal;
          font-weight: 600;
          font-size: 10px;
          line-height: 12px;
          letter-spacing: 0.1px;
          text-transform: uppercase;
          padding: 5px;

           h3 {
            margin: 20px;
            font-size: 12px;
            text-align: center;
           }
        }

        td {
          padding: 3px;
        }
    }
</style>

<Modal display={displayModal} hideCloseButton>
    <h2>
      Select Token
    </h2>
    <Form>
        <Input on:changed={updateQuery} name="query" focus fluid placeholder="Search tokens..." />
    </Form>
    <table>
        <tr>
          <th colspan="2"> Token </th>
          <th> Balance </th>
        </tr>

        {#if tokens.length > 0}
            {#each filteredTokens as token}
              <tr>
                <td colspan="3">
                  <TokenSelectorRow
                    onClick={() => changeToken(token)}
                    token={token}
                    isTableRow
                  />
                </td>
              </tr>
            {/each}
        {:else}
            <tr>
              <th colspan="3">
                  <h3>
                    No tokens found...
                  </h3>
              </th>
            </tr>
        {/if}
    </table>
</Modal>

<TokenSelectorRow
  onClick={() => $displayModal = true}
  token={selectedToken}
/>
