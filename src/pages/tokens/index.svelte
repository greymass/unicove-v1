<script>
    import Page from '~/components/layout/page.svelte'
    import {activeSession, activeBlockchain, currentAccount} from '~/store'
    import {tokenBalancesTicker} from '~/token-balances-ticker'
    import {priceTicker} from '~/price-ticker'
    import Button from '~/components/elements/button.svelte'

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

    $: console.log({bloksAccountUrl})
    $: console.log({a: $currentAccount})
</script>

<style type="scss">
  .container {
    width: 600px;

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

    table {
        margin-bottom: 20px;
        width: 600px;

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
                    top: 15px;
                    width: 30px;
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

</style>

<Page title="Tokens">
  <div class="container">
    <h2>
        Account
    </h2>
    <h3>
        {$currentAccount?.account_name?.toString() || '_____'} - total value $ {totalUsdValue.toFixed(2) || '___'}
    </h3>
   <table>
      <tr>
          <th colspan="2">
            Token
          </th>
           <th>
             Balance
           </th>
           <th>
             Value
           </th>
      </tr>
      <tr>
          <td>
            <img src={`https://www.bloks.io/img/chains/${
                $activeBlockchain?.coreTokenSymbol?.toString()?.split(',')[1]?.toLowerCase()
            }.png`} />
          </td>
            <td>
              {$activeBlockchain?.coreTokenSymbol?.toString()?.split(',')[1]}
            </td>
             <td>
               {$currentAccount?.core_liquid_balance?.toString()}
             </td>
             <td>
               {coreTokenUsdValue.toFixed(2)} USD
             </td>
        </tr>
        {#each Object.values($tokenBalances?.tokens || {}) as token}
            <tr>
                <td>
                  <img src={token.logo} />
                </td>
                <td>
                  {token.name}
                </td>
                 <td>
                   {token.balance.toString()}
                 </td>
                 <td>
                   {token.usdValue.toString()}
                 </td>
            </tr>
        {/each}
    </table>
    <div class="button-container">
        <a href="/transfer">
            <Button size="large">Create new transfer</Button>
        </a>
        <a href={bloksAccountUrl} target="_blank">
            <Button size="large">View on block explorer</Button>
        </a>
    </div>
  </div>
</Page>
