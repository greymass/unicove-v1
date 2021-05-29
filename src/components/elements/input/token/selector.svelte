<script>
    import {derived, writable} from 'svelte/store'
    import type {Readable, Writable} from 'svelte/store'
    import type {Token, TokenWithBalance} from '~/stores/tokens'

    import Form from '~/components/elements/form.svelte'
    import Input from '~/components/elements/input.svelte'
    import Modal from '~/components/elements/modal.svelte'
    import Icon from '~/components/elements/icon.svelte'

    import TokenSelectorRow from './selector/row.svelte'

    export let tokens: TokenWithBalance[]
    export let defaultToken: TokenWithBalance
    export let onTokenSelect: () => void

    let selectedToken = defaultToken
    let displayModal = writable<boolean>(false)
    let query: string = ''

    function updateQuery({detail}: {detail: any}): void {
        query = detail.value
    }

    function changeToken(token: Token) {
        selectedToken = token

        onTokenSelect(token)

        $displayModal = false
    }

    let filteredTokens = []

    $: {
        filteredTokens = tokens.filter((token) => {
            return query.length === 0 || token.name.toLowerCase().includes(query.toLowerCase())
        })
    }
</script>

<style type="scss">
    .close-button {
        color: var(--main-blue);
        cursor: pointer;
        padding: 32px 22px;
        position: absolute;
        right: 0;
        top: 0;
    }

    h2 {
        text-align: left;
        margin: 10px 3px;
    }

    .table-container {
        max-height: 60vh;
        overflow: scroll;
        margin-top: 20px;

        table {
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
    }
</style>

<Modal display={displayModal} hideCloseButton>
    <div on:click={() => ($displayModal = false)} class="close-button">
        <Icon name="x" />
    </div>
    <h2>Select Token</h2>
    <Form>
        <Input
            on:changed={updateQuery}
            value={query}
            name="query"
            focus
            fluid
            placeholder="Search tokens..."
        />
    </Form>
    <div class="table-container">
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
                                {token}
                                isTableRow
                            />
                        </td>
                    </tr>
                {/each}
            {:else}
                <tr>
                    <th colspan="3">
                        <h3>No tokens found...</h3>
                    </th>
                </tr>
            {/if}
        </table>
    </div>
</Modal>

<TokenSelectorRow onClick={() => ($displayModal = true)} token={selectedToken} />
