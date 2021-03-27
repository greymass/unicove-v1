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
    <table>
      <tr>
          <th>
            Token
          </th>
           <th/>
      </tr>
      <tr>
            <td>
              {$activeBlockchain?.coreTokenSymbol?.toString()}
            </td>
             <td>
               {$currentAccount?.core_liquid_balance?.toString()}
             </td>
        </tr>
        {#each Object.values($tokenBalances) as token}
            <tr>
                <td>
                  {token.name}
                </td>
                 <td>
                   {token.balance.toString()}
                 </td>
            </tr>
        {/each}

    </table>
    <h2>
        Current Balance:
        <span>
            {$currentAccount?.core_liquid_balance?.toString()}
        </span>
        <p>
            {usdValue.toFixed(2)} USD
        </p>
        <a href={`/transfer`}> Transfer </a>
    </h2>

    {#if tokenBalances && $tokenBalances}
        <div class="tokensContainer">
            {#each Object.values($tokenBalances) as token}
                <div class="tokenContainer">
                    <h2>
                        {token.name}
                    </h2>
                    <p>
                        Balance: {token.balance.toString()} ({token.usdValue.toString()})
                    </p>
                    <a href={`/transfer/${token.name.toLowerCase()}`}> Transfer </a>
                </div>
            {/each}
        </div>
    {/end}
</Page>
