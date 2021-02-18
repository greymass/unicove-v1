<script lang="ts">
    import InputAsset from '~/components/elements/input/asset.svelte'
    import Button from '~/components/elements/button.svelte'

    export let amount: string | undefined = undefined
    export let toAddress: string | undefined = undefined
    export let availableBalance: number | undefined = undefined
    export let step: string | undefined = undefined

    let valid: boolean = false

    function handleKeydown(event) {
      console.log('handleKeyDown')
      console.log({event})
      if (valid && event.key === 'Enter') {
        step = 'confirm'
      }
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

<svelte:window on:keydown={handleKeydown}/>

<div class="container">
    <div class="field-container">
        <InputAsset
          bind:valid={valid}
          bind:value={amount}
          focus
          fullWidth
          name="amount"
          placeholder="amount to be transfered.."
          {availableBalance}
        />
    </div>
    <Button size="large" disabled={!valid} on:action={() => step = 'confirm'}>
      Continue
    </Button>
</div>


