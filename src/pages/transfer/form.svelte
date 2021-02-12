<script lang="ts">
    import Button from '~/components/elements/button.svelte'
    import Input from '~/components/elements/input.svelte'
    import InputAccount from '~/components/elements/input/account.svelte'
    import InputAsset from '~/components/elements/input/asset.svelte'
    import Form from '~/components/elements/form.svelte'
    import TransactionNotificationSuccess from '~/components/elements/notification/transaction/success.svelte'
    import FieldContainer from './form/fieldContainer.svelte'

    export let toAddress
    export let toAccount
    export let activeBlockchain
    export let activeSession
    export let amount
    export let quantity
    export let memo
    export let transfer
    export let availableBalance
    export let txFee

    let displaySuccessTx

    async function handleTransfer() {
        const transferData = await transfer(activeBlockchain, activeSession, {
            toAddress,
            toAccount,
            quantity,
            memo,
            txFee,
        })

        amount = ''
        toAccount = ''
        toAddress = ''
        memo = ''
        displaySuccessTx = transferData?.payload?.tx
    }
</script>

<style type="scss">
    h4 {
        color: green;
    }
</style>

<Form>
    <FieldContainer label="To" placeholder="select" value={toAccount || toAddress}>
        {#if activeBlockchain.id === 'fio'}
            <Input fullWidthOnMobile name="to" bind:value={toAddress} />
        {:else}
            <InputAccount fullWidthOnMobile name="to" {activeSession} bind:value={toAccount} />
        {/if}
    </FieldContainer>

    <FieldContainer label="Amount" secondLabel="Value" placeholder="0.0" value={amount}>
        <InputAsset fullWidthOnMobile name="amount" {availableBalance} bind:value={amount} />
    </FieldContainer>

    {#if activeBlockchain.id !== 'fio'}
        <FieldContainer label="Memo (Optional)" placeholder="Add" value={memo}>
            <Input fullWidthOnMobile name="memo" bind:value={memo} />
        </FieldContainer>
    {/if}

    <Button fullWidthOnMobile formValidation on:action={handleTransfer}
        >Create Transfer Request</Button
    >
    {#if displaySuccessTx}
        <TransactionNotificationSuccess
            tx={displaySuccessTx}
            {activeBlockchain}
            onClose={() => (displaySuccessTx = '')}
        />
    {/if}
</Form>
