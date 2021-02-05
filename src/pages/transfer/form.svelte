<script>
    import Button from '~/components/elements/button.svelte'
    import Input from '~/components/elements/input.svelte'
    import InputAccount from '~/components/elements/input/account.svelte'
    import InputAsset from '~/components/elements/input/asset.svelte'
    import Form from '~/components/elements/form.svelte'
    import TransactionNotificationSuccess from '~/components/elements/notification/transaction/success.svelte'

    export let toAddress
    export let toAccount
    export let activeBlockchain
    export let activeSession
    export let amount
    export let quantity
    export let memo
    export let transfer

    let displaySuccessTx

    async function handleTransfer() {
        const transferData = await transfer(activeBlockchain, activeSession, {
            toAddress,
            toAccount,
            quantity,
            memo,
        })

        amount = ''
        toAccount = ''
        toAddress = ''
        memo = ''
        displaySuccessTx = transferData?.payload?.tx
    }
</script>

<style>
    label {
        display: block;
        margin: 5px 0;
    }

    .field {
        margin: 20px 0;
    }

    h4 {
        color: green;
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
    <Button formValidation on:action={handleTransfer}>Go</Button>
    {#if displaySuccessTx}
        <TransactionNotificationSuccess
            tx={displaySuccessTx}
            {activeBlockchain}
            onClose={() => (displaySuccessTx = '')}
        />
    {/if}
</Form>
