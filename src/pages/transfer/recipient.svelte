<script lang="ts">
    import type {ChainConfig} from '~/config'
    import type {LinkSession} from 'anchor-link'

    import InputAccount from '~/components/elements/input/account.svelte'
    import InputAddress from '~/components/elements/input/address.svelte'
    import Button from '~/components/elements/button.svelte'

    export let toAccount: string | undefined = undefined
    export let toAddress: string | undefined = undefined
    export let activeBlockchain: ChainConfig
    export let activeSession: LinkSession
    export let step: string | undefined = undefined

    let valid: boolean = false
    let disabledButton: boolean = true

    $: {
      disabledButton = !valid
    }

</script>

<style type="scss">
    .container {
      display: flex;
      flex-direction: column;

      .field-container {
         margin: 20px 0;
      }
    }
</style>

<div class="container">
    <div class="field-container">
        {#if activeBlockchain.id === 'fio'}
            <InputAddress
              bind:valid={valid}
              bind:value={toAddress}
              focus
              fullWidth
              name="to"
              placeholder="recipient address or public key.."
            />
        {:else}
            <InputAccount
                bind:valid={valid}
                bind:value={toAccount}
                focus
                fullWidth
                name="to"
                placeholder="recipient account name.."
                {activeSession}
            />
        {/if}
    </div>

    <Button size="large" disabled={disabledButton} on:action={() => step = 'amount'}>
      Continue
    </Button>
</div>

