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

    $: usdValue = ($currentAccount?.core_liquid_balance?.value || 0) * ($price || 0)

    $: console.log({c: $tokenBalances})
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
              padding: 10px 0 24px 0;
              border-bottom: 1px solid var(--divider-grey);

              &:first-child {
                width: 30px;
                border: none;
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
        {$currentAccount?.account_name?.toString() || '_____'} - total value $ {$tokenBalances?.totalUsdValue?.toFixed(2) || '___'}
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
            {$activeBlockchain?.coreTokenSymbol?.toString()?.split(',')[1]}
          </td>
            <td>
              {$activeBlockchain?.coreTokenSymbol?.toString()?.split(',')[1]}
            </td>
             <td>
               {$currentAccount?.core_liquid_balance?.toString()}
             </td>
             <td>
               {usdValue.toFixed(2)} USD
             </td>
        </tr>
        {#each Object.values($tokenBalances?.tokens || {}) as token}
            <tr>
                <td>
                  {token.name}
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
        <a href={$currentAccount?.bloksUrl}>
            <Button size="large">View on block explorer</Button>
        </a>
    </div>
  </div>
</Page>
