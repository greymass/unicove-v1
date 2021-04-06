<script>
    import Page from '~/components/layout/page.svelte'
    import {activeSession, activeBlockchain, currentAccount} from '~/store'
    import {tokenBalancesTicker} from '~/token-balances-ticker'
    import {priceTicker} from '~/price-ticker'

    import Button from '~/components/elements/button.svelte'
    import Header from '~/components/layout/header.svelte'

    $: tokenBalances =
        $activeSession &&
        tokenBalancesTicker($activeSession, $activeBlockchain).catch((error) => {
            console.warn(`Unable to load price on ${$activeBlockchain.id}`, error)
        })

    $: price = priceTicker($activeBlockchain).catch((error) => {
        console.warn(`Unable to load price on ${$activeBlockchain.id}`, error)
    })

    $: coreTokenUsdValue = ($currentAccount?.core_liquid_balance?.value || 0) * ($price || 0)
    $: totalUsdValue = ((tokenBalances && $tokenBalances?.totalUsdValue) || 0) + coreTokenUsdValue
    $: bloksAccountUrl = `https://www.${
        $activeBlockchain?.id === 'eos' ? '' : `${$activeBlockchain.id}.`
    }bloks.io/account/${String($currentAccount?.account_name)}`
</script>

<style type="scss">
    @media only screen and (max-width: 600px) {
        .container {
            width: 100%;
        }
    }

    @media only screen and (min-width: 601px) {
        .container {
            width: 600px;
            margin: auto;
        }
    }
    .container {
        @media only screen and (max-width: 600px) {
            table {
                width: 100%;
            }
        }
        @media only screen and (min-width: 601px) {
            table {
                width: 600px;
            }
        }

        table {
            tr {
                th {
                    height: 30px;
                    width: 30%;
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

                @media only screen and (max-width: 600px) {
                    td {
                        width: 80px;
                    }
                }

                td {
                    width: 120px;
                    padding: 24px 0;
                    border-bottom: 1px solid var(--divider-grey);

                    @media only screen and (min-width: 601px) {
                        &:first-child {
                            width: 40px;
                        }
                    }

                    @media only screen and (max-width: 600px) {
                        &:first-child {
                            width: 80px;
                        }
                    }

                    &:first-child {
                        border: none;
                        padding: 0;
                        height: 30px;
                        position: relative;

                        img {
                            position: absolute;
                            top: 15px;
                            width: 30px;
                        }
                    }
                }
            }
        }

        @media only screen and (min-width: 600px) {
            .buttons-container {
                display: flex;
                flex-direction: row;
                padding: 20px 0;

                .button-container {
                    display: flex;
                    flex-direction: column;
                    width: 50%;
                    padding: 5px;
                }
            }
        }

        @media only screen and (max-width: 600px) {
            .buttons-container {
                display: flex;
                flex-direction: column;
                padding: 20px 0;

                .button-container {
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    padding: 10px;
                }
            }
        }
    }
</style>

<Page>
    <div class="container">
        <Header
            title="Account"
            subtitle={`${String($currentAccount?.account_name) || '_____'} - total value $ ${
                totalUsdValue.toFixed(2) || '___'
            }`}
        />
        <table>
            <tr>
                <th colspan="2"> Token </th>
                <th> Balance </th>
                <th> Value </th>
            </tr>
            <tr>
                <td>
                    <img
                        alt="logo icon"
                        src={`https://www.bloks.io/img/chains/${$activeBlockchain?.coreTokenSymbol?.name?.toLowerCase()}.png`}
                    />
                </td>
                <td>
                    {$activeBlockchain?.coreTokenSymbol?.name}
                </td>
                <td>
                    {String($currentAccount?.core_liquid_balance)}
                </td>
                <td>
                    {coreTokenUsdValue.toFixed(2)} USD
                </td>
            </tr>
            {#each Object.values((tokenBalances && $tokenBalances?.tokens) || {}) as token}
                <tr>
                    <td>
                        <img alt="logo icon" src={token.logo} />
                    </td>
                    <td>
                        {token.name}
                    </td>
                    <td>
                        {String(token.balance)}
                    </td>
                    <td>
                        {String(token.usdValue)}
                    </td>
                </tr>
            {/each}
        </table>
        <div class="buttons-container">
            <div class="button-container">
                <Button href="/transfer" size="large">Create new transfer</Button>
            </div>
            <div class="button-container">
                <Button href={bloksAccountUrl} size="large">View on block explorer</Button>
            </div>
        </div>
    </div>
</Page>
