<script>
    import {derived, writable} from 'svelte/store'
    import type {Readable, Writable} from 'svelte/store'

    import Form from '~/components/elements/form.svelte'
    import Input from '~/components/elements/input.svelte'
    import Modal from '~/components/elements/modal.svelte'
    import Icon from '~/components/elements/icon.svelte'

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

    .selector-button {
      padding: 10px 12px;
      border-radius: 12px;
      width: 200px;
      border: 1px solid var(--divider-grey);
      position: relative;

      .icon-container {
        padding: 5px;
        margin-right: 5px;
      }

      .name-text {
        font-family: Inter;
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        letter-spacing: -0.04px;
        color: var(--main-black);
        display: inline;
      }

      .balance-container {
        display: inline;
        font-size: 12px;
        float: right;
        padding: 5px;
        width: 60px;
      }

      .arrow-container {
        position: absolute;
        right: 10px;
        bottom: 0;
        width: 20px;
        padding: 10px;
      }
    }
</style>

<Modal display={displayModal}>
    <Form>
        <Input on:changed={updateQuery} name="query" focus fluid placeholder="Search tokens..." />
    </Form>
    <table>
        <tbody>
            {#each tokens as token}
                <tr
                    on:click={() => {
                        changeToken(token)
                    }}
                >
                    <td>
                        <img alt={String(record.token.name)} src={record.token.logo} />
                    </td>
                    <td>
                        {token.name}
                    </td>
                    <td>
                        {token.balance.quantity.value}
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</Modal>

<div on:click={() => $displayModal = true} class="selector-button">
  <span class="icon-container">
    <img src={selectedToken.icon}>
  </span>
  <h2 class="name-text">
    {selectedToken.name}
  </h2>
  <span class="balance-container">
     {selectedToken.balance}
  </span>
  <div class="arrow-container">
      <Icon name="chevron-right" />
  </div>
</div>
