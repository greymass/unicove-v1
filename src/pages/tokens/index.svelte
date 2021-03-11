<script>
  import {onMount} from 'svelte'
  import {currentAccount} from '~/store'
  import Page from '~/components/layout/page.svelte'
  import {activeBlockchain} from '~/store'
  import {syncTokenBalances, stopSyncTokenBalances, tokensData} from './tokensData'
  import {priceTicker} from '~/price-ticker'

  onMount(() => {
    syncTokenBalances()

    return () => {
        // on unmount
        stopSyncTokenBalances()
    }
 })


 $: price = priceTicker($activeBlockchain).catch((error) => {
     console.warn(`Unable to load price on ${$activeBlockchain.id}`, error)
 })

 $: usdValue = $currentAccount?.core_liquid_balance.value * $price

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
      Current Balance:
      <span>
        {$currentAccount?.core_liquid_balance.toString()}
      </span>
      <p>
        {usdValue.toFixed(2)} USD
      </p>
  </h2>

  {#if $tokensData}
      <div class="tokensContainer">
            {#each Object.values($tokensData) as token}
              <div class="tokenContainer">
                <h2>
                    {token.name}
                </h2>
                <p>
                    Balance: {token.balance.toString()} ({token.usdValue.toString()})
                </p>
              </div>
            {/each}
       </div>
  {:else}
    <div class="noTokensContainer">
      <h3>
        You do not currently have any token balances.
      </h3>
    </div>
  {/if}
</Page>

