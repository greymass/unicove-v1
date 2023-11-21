<script>
    import {writable} from 'svelte/store'
    import {Asset} from 'anchor-link'

    import {activeBlockchain} from '~/store'
    import type {Token} from '~/stores/tokens'
    import {tokenFromBalance, tokens} from '~/stores/tokens'
    import {balances} from '~/stores/balances'

    import Form from '~/components/elements/form.svelte'
    import Input from '~/components/elements/input.svelte'
    import Modal from '~/components/elements/modal.svelte'
    import Icon from '~/components/elements/icon.svelte'

    import TokenSelectorRow from './selector/row.svelte'
    import Balance from '../../form/balance.svelte'

    export let defaultToken: Token | undefined = undefined
    export let selectedToken: Token | undefined = undefined
    export let tokenOptions: Token[] | undefined = undefined
    export let onTokenSelect: (token: Token) => void
    export let showTokensWithoutBalance: boolean = false
    export let includeEvmTokens: boolean = false

    $: {
        if (defaultToken) {
            selectedToken = defaultToken
        }
    }

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

    let filteredTokens: Token[] = []

    $: {
        if (tokenOptions) {
            filteredTokens =
                showTokensWithoutBalance ? tokenOptions : tokenOptions.filter((token) => hasBalance(token))
        } else {
            filteredTokens = showTokensWithoutBalance ? $tokens : $balances.map((balance) => {
                const token = $tokens.find((t) => t.key === balance.tokenKey)

                return token || tokenFromBalance(balance)
            })
            
            filteredTokens = filteredTokens.filter((token) => {
                if (token.evm && !includeEvmTokens) return false

                const blockchainMatches = token.chainId.equals($activeBlockchain.chainId)
                const queryExists = query.length === 0
                const queryMatches = String(token.name)
                    .toLowerCase()
                    .includes(query.toLowerCase())

                return (
                    blockchainMatches &&
                    hasBalance(token) &&
                    (queryExists || queryMatches)
                )
            }) || []
        }
    }

    function hasBalance(token: Token, balance?: Balance) {
        const balanceEntry = balance || $balances.find((b) => b.tokenKey === token?.key)

        return !!balanceEntry?.quantity && balanceEntry.quantity.value > 0
    }
</script>

<style type="scss">
    .close-button {
        color: var(--lapis-lazuli);
        cursor: pointer;
        padding: 32px 22px;
        position: absolute;
        right: 0;
        top: 0;
        :global(.darkmode) & {
            color: var(--middle-green-eagle);
        }
    }

    h2 {
        text-align: left;
        margin: 10px 3px;
    }

    .table-container {
        max-height: 60vh;
        overflow-y: scroll;
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

    .placeholder {
        padding: 10px 12px;
        border-radius: 12px;
        max-width: 400px;
        border: 1px solid var(--divider-grey);
        display: flex;
        align-items: center;
        cursor: pointer;

        .text-container {
            flex: 1;
            font-family: Inter;
            font-style: normal;
            font-weight: 500;
            font-size: 14px;
            letter-spacing: -0.04px;
            color: var(--main-black);
            display: inline;
            text-align: left;
        }

        .arrow-container {
            display: flex;
            width: 20px;
        }
    }
</style>

<Modal display={displayModal} hideCloseButton>
    <div on:click={() => ($displayModal = false)} class="close-button">
        <Icon name="x" />
    </div>
    <h2>Select Token</h2>
    {#if !tokenOptions}
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
    {/if}
    <div class="table-container">
        <table>
            <tr>
                <th colspan="2"> Token </th>
                <th> Balance </th>
            </tr>

            {#if filteredTokens.length > 0}
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

{#if selectedToken}
    <TokenSelectorRow
        onClick={() => ($displayModal = true)}
        token={selectedToken || defaultToken}
    />
{:else}
    <div class="placeholder" on:click={() => ($displayModal = true)}>
        <span class="text-container"> Select Token </span>
        <div class="arrow-container">
            <Icon name="chevron-right" size="large" />
        </div>
    </div>
{/if}
