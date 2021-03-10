<script>
  import {onMount} from 'svelte'
  import {currentAccount} from '~/store'
  import Page from '~/components/layout/page.svelte'
  import {syncTokenBalances, stopSyncTokenBalances, tokensData} from './tokensData'

  onMount(() => {
    syncTokenBalances()

    return () => {
        // on unmount
        stopSyncTokenBalances()
    }
 })

</script>

<style type="scss">

  h2 {
      margin-top: 30px;

      span {
        text-decoration: underline;
        margin-left: 10px;
      }
  }

</style>
<Page title="Tokens">
  <h2>
      Current Balance:
      <span>
        {$currentAccount?.core_liquid_balance.toString()}
      </span>
  </h2>
  {#if $tokensData}
      {#each Object.values($tokensData) as token}
          <div>
            <h2>
                {token.name}
            </h2>
            <p>
                Balance: {token.balance.toString()} ({token.usdValue.toString()})
            </p>
          </div>
      {/each}
  {/if}
</Page>

