<script>
    import Page from '~/components/layout/page.svelte'
    import {activeSession, activeBlockchain, currentAccount} from '~/store'
    import {tokenBalancesTicker} from '~/token-balances-ticker'
    import {priceTicker} from '~/price-ticker'
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
    $: totalUsdValue = ($tokenBalances?.totalUsdValue || 0) + coreTokenUsdValue
    $: bloksAccountUrl = `https://www.${
      $activeBlockchain?.id === 'eos' ? '' : `${$activeBlockchain.id}.`
    }bloks.io/account/${$currentAccount?.account_name?.toString()}`
    $: coreTokenSymbol = $activeBlockchain?.coreTokenSymbol?.toString()?.split(',')[1]?.toLowerCase()
</script>

<style type="scss">
  .container {
    max-width: 400px;
    margin: auto;

    h2 {
        margin-top: 30px;
        font-family: Inter;
        font-style: normal;
        font-weight: bold;
        font-size: 24px;
        line-height: 29px;
        letter-spacing: -0.47px;
        color: var(--main-black);
    }

    h3 {
      font-family: Inter;
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
      line-height: 19px;
      letter-spacing: -0.26px;
      color: var(--dark-grey);

      margin-bottom: 30px;
    }

    .tokensContainer {
        padding: 20px 0 40px 0;
    }

    .noTokensContainer {
        padding: 20px;
        max-width: 250px;
        margin-top: 40px;

        h3 {
            text-align: center;
        }
    }

    .selector-container {
      height: 500px;
      overflow-y: scroll;

       table {
              margin-bottom: 20px;
              width: 360px;

              tr {
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
                    width: 120px;
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

          .button-container {
            display: flex;
            flex-direction: row;

            a {
              width: 300px;
              display: flex;
              flex-direction: column;
              padding: 5px;
            }
          }
        }
    }

</style>

<Page>
  <div class="container">
    <Header
      title="Create Transfer"
      subtitle="Step of 1 of 3"
    />

    <div class="selector-container">
    <table>
          <tr>
              <th colspan="3">
                Token
              </th>
          </tr>
          <tr onclick={`window.location='/transfer/${coreTokenSymbol}';`}>
              <td>
                <img src={`https://www.bloks.io/img/chains/${coreTokenSymbol}.png`} />
              </td>
                <td>
                  {$activeBlockchain?.coreTokenSymbol?.toString()?.split(',')[1]}
                </td>
                 <td>
                   {$currentAccount?.core_liquid_balance?.toString()}
                 </td>
            </tr>
            {#each Object.values($tokenBalances?.tokens || {}) as token}
                <tr onclick={`window.location='/transfer/${token.name?.toLowerCase()}';`}>
                    <td>
                      <img src={token.logo} />
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
