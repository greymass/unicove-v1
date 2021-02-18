<script lang="ts">
    import InputAsset from '~/components/elements/input/asset.svelte'
    import Button from '~/components/elements/button.svelte'

    export let amount: string | undefined = undefined
    export let toAddress: string | undefined = undefined
    export let availableBalance: number | undefined = undefined
    export let step: string | undefined = undefined

    let valid: boolean = false
</script>

<style type="scss">
    div {
      display: flex;
      flex-direction: column;
      margin: 20px 0;
    }
</style>

<div>
    <InputAsset
      bind:valid={valid}
      bind:value={amount}
      name="amount"
      placeholder="Amount to be transfered"
      {availableBalance}
    />
</div>

<Button size="large" disabled={!valid} on:action={() => step = 'confirm'}>
  Continue
</Button>
