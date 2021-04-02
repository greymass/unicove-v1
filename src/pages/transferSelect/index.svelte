<script>
    import Page from '~/components/layout/page.svelte'
    import {activeSession, activeBlockchain, currentAccount} from '~/store'
    import {tokenBalancesTicker} from '~/token-balances-ticker'
    import Header from '~/components/layout/header.svelte'

    $: tokenBalances =
        $activeSession &&
        tokenBalancesTicker($activeSession, $activeBlockchain).catch((error) => {
            console.warn(`Unable to load price on ${$activeBlockchain.id}`, error)
        })

    $: coreTokenSymbol = $activeBlockchain?.coreTokenSymbol
        ?.toString()
        ?.split(',')[1]
        ?.toLowerCase()
</script>

<style type="scss">
    .container {
        width: 400px;
        max-width: 100%;
        margin: auto;

        .selector-container {
            height: 500px;
            overflow-y: scroll;
            overflow-x: hidden;
            max-width: 100%;

            table {
                margin-bottom: 20px;
                width: 360px;
                max-width: 100%;

                tr {
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
                            width: 40px;
                            border: none;
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

<Page>
    <div class="container">
        <Header title="Create Transfer" subtitle="Step of 1 of 3" />

        <div class="selector-container">
            <table>
                <tr>
                    <th colspan="3"> Token </th>
                </tr>
                <tr onclick={() => { window.location.href = `/transfer/${coreTokenSymbol}`; }}>
                    <td>
                        <img alt="token symbol" src={`https://www.bloks.io/img/chains/${coreTokenSymbol}.png`} />
                    </td>
                    <td>
                        {$activeBlockchain?.coreTokenSymbol?.toString()?.split(',')[1]}
                    </td>
                    <td>
                        {$currentAccount?.core_liquid_balance?.toString()}
                    </td>
                </tr>
                {#each Object.values((tokenBalances && $tokenBalances?.tokens) || {}) as token}
                    <tr onclick={() => { window.location.href = `/transfer/${token.name?.toLowerCase()}`; }}>
                        <td>
                            <img alt="token symbol" src={token.logo} />
                        </td>
                        <td>
                            {token.name}
                        </td>
                        <td>
                            {token.balance.toString()}
                        </td>
                    </tr>
                {/each}
            </table>
        </div>
    </div>
</Page>
