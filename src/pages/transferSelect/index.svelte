<script>
    import {router} from 'tinro'

    import Page from '~/components/layout/page.svelte'
    import {activeSession, activeBlockchain, currentAccount} from '~/store'
    import {tokenBalancesTicker} from '~/token-balances-ticker'

    $: tokenBalances =
        $activeSession &&
        tokenBalancesTicker($activeSession, $activeBlockchain).catch((error) => {
            console.warn(`Unable to load price on ${$activeBlockchain.id}`, error)
        })

    $: coreTokenSymbolName = $activeBlockchain?.coreTokenSymbol?.name
</script>

<style type="scss">
    .container {
        max-width: 100%;
        margin: auto;

        .selector-container {
            height: 500px;
            overflow-y: scroll;
            overflow-x: hidden;
            max-width: 100%;

            table {
                margin-bottom: 20px;
                width: 100%;

                tr {
                    cursor: pointer;
                    max-width: 100%;

                    th {
                        height: 30px;
                        font-family: Inter;
                        font-style: normal;
                        font-weight: 600;
                        font-size: 12px;
                        line-height: 12px;
                        text-align: left;
                        letter-spacing: 0.1px;
                        text-transform: uppercase;
                        color: var(--dark-grey);
                    }

                    td {
                        width: 100px;
                        padding: 24px 0;
                        border-bottom: 1px solid var(--divider-grey);

                        &:first-child {
                            max-width: 40px;
                            padding: 0;
                            height: 30px;
                            position: relative;

                            img {
                                position: absolute;
                                top: 17px;
                                width: 25px;
                            }
                        }
                    }
                }
            }
        }
    }
</style>

<Page title="Create Transfer" subtitle="Step 1 of 3">
    <div class="container">
        <div class="selector-container">
            <table>
                <tr>
                    <th colspan="3"> Token </th>
                </tr>
                <tr on:click={() => router.goto(`/transfer/${coreTokenSymbolName?.toLowerCase()}`)}>
                    <td>
                        <img
                            alt="token symbol"
                            src={`https://www.bloks.io/img/chains/${coreTokenSymbolName?.toLowerCase()}.png`}
                        />
                    </td>
                    <td>
                        {coreTokenSymbolName}
                    </td>
                    <td>
                        {$currentAccount?.core_liquid_balance?.value}
                    </td>
                </tr>
                {#each Object.values((tokenBalances && $tokenBalances?.tokens) || {}) as token}
                    <tr on:click={() => router.goto(`/transfer/${token.name?.toLowerCase()}`)}>
                        <td>
                            <img alt="token symbol" src={token.logo} />
                        </td>
                        <td>
                            {token.name}
                        </td>
                        <td>
                            {token.balance.value}
                        </td>
                    </tr>
                {/each}
            </table>
        </div>
    </div>
</Page>
