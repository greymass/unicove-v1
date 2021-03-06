<script>
 import {onMount} from 'svelte'
  import {activeAccount} from '~/store'
  import {syncTokenBalances, stopSyncTokenBalances, tokensData} from './tokensData'

  onMount(() => {
    syncTokenBalances()

    return () => {
        // on unmount
        stopSyncTokenBalances()
    }
 })

</script>

<div>
  <h2>
      System Token: {$activeAccount?.core_liquid_balance.units}
  </h2>
  {#each Object.values($tokensData) as token}
      <div>
        <h2>
            {token.name}
        </h2>
        <p>
            Balance: {token.balance.units}
        </p>
      </div>
  {/each}
</div>
