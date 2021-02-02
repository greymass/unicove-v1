<script>
    import Button from '~/components/elements/button.svelte'
    import Input from '~/components/elements/input.svelte'
    import InputAccount from '~/components/elements/input/account.svelte'
    import InputAsset from '~/components/elements/input/asset.svelte'
    import Form from '~/components/elements/form.svelte'

    export let toAddress;
    export let toAccount;
    export let activeBlockchain;
    export let amount;
    export let memo;
</script>

<Form>
    <label>
      To
    </label>
    {#if activeBlockchain.id === 'fio'}
        <Input name="to" bind:value={toAddress} />
    {:else}
        <InputAccount name="to" bind:value={toAccount} />
    {/if}
    <label>
        Amount
    </label>
    <InputAsset name="amount" bind:value={amount} />
    {#if $activeBlockchain.id === 'fio'}
    <label>
         Memo <i>(Optional)</i>
    </label>
    <Input name="memo" bind:value={memo} />
    {/if}

    <Button formValidation on:action={transfer}>Go</Button>
</Form>
