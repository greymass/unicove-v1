<script>
    import Button from '~/components/elements/button.svelte'
    import Input from '~/components/elements/input.svelte'
    import InputAccount from '~/components/elements/input/account.svelte'
    import InputAsset from '~/components/elements/input/asset.svelte'
    import Form from '~/components/elements/form.svelte'

    export let toAddress
    export let toAccount
    export let activeBlockchain
    export let amount
    export let memo
    export let transfer
</script>

<style>
    label {
        display: block;
        margin: 5px 0;
    }

    .field {
        margin: 20px 0;
    }
</style>

<Form>
    <div class="field">
        <label> To </label>
        {#if activeBlockchain.id === 'fio'}
            <Input name="to" bind:value={toAddress} />
        {:else}
            <InputAccount name="to" bind:value={toAccount} />
        {/if}
    </div>

    <div class="field">
        <label> Amount </label>
        <InputAsset name="amount" bind:value={amount} />
    </div>
    {#if activeBlockchain.id === 'fio'}
        <div class="field">
            <label>
                Memo <i>(Optional)</i>
            </label>
            <Input name="memo" bind:value={memo} />
        </div>
    {/if}
    <Button formValidation on:action={transfer}>Go</Button>
</Form>
