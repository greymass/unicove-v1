<script>
    import Page from '~/components/layout/page.svelte'
    import {activeSession, activeBlockchain, currentAccount} from '~/store'
    import {tokenBalancesTicker} from '~/token-balances-ticker'
    import {priceTicker} from '~/price-ticker'

    $: tokenBalances =
        $activeSession &&
        tokenBalancesTicker($activeSession, $activeBlockchain).catch((error) => {
            console.warn(`Unable to load price on ${$activeBlockchain.id}`, error)
        })

    $: price = priceTicker($activeBlockchain).catch((error) => {
        console.warn(`Unable to load price on ${$activeBlockchain.id}`, error)
    })

    $: usdValue = ($currentAccount?.core_liquid_balance?.value || 0) * ($price || 0)
</script>

<style type="scss">
    h2 {
        margin-top: 30px;

        span {
            text-decoration: underline;
            margin-left: 10px;
        }
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
</style>

<Page title="Tokens">
    <h2>
        Account
    </h2>
    <h3>
        {$currentAccount.name} - total value {$tokenBalances.totalUSD}
    </h3>
   <table>
      <tr>
          <th>
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
              {$activeBlockchain?.coreTokenSymbol?.toString()}
            </td>
             <td>
               {$currentAccount?.core_liquid_balance?.toString()}
             </td>
             <td>
               {usdValue.toFixed(2)} USD
             </td>
        </tr>
        {#each Object.values($tokenBalances.tokens) as token}
            <tr>
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
        <a href={$currentAccount.bloksUrl}>
            <Button size="large">View on block explorer</Button>
        </a>
    </div>
</Page>
