<script lang="ts">
    import Button from '~/components/elements/button.svelte'
    import Input from '~/components/elements/input.svelte'
    import InputAccount from '~/components/elements/input/account.svelte'
    import InputAddress from '~/components/elements/input/address.svelte'
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

    let toAccountValid: boolean = false
    let toAddressValid: boolean = false
    let amountValid: boolean = false

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
    console.log('form')
    console.log({quantity})
    console.log({value: quantity.toString()})
</script>

<style type="scss">
    h4 {
        color: green;
    }

    .button-container {
      display: flex;
      flex-direction: column;
      margin: 20px 0;
    }
</style>

<Form>
        {#if activeBlockchain.id === 'fio'}
            <FieldContainer label="To" placeholder="select" valid={toAddressValid} value={toAddress}>
                <InputAddress name="to" bind:value={toAddress} bind:valid={toAddressValid} />
            </FieldContainer>
        {:else}
            <FieldContainer label="To" placeholder="select" valid={toAccountValid} value={toAccount}>
                <InputAccount name="to" {activeSession} bind:value={toAccount} bind:valid={toAccountValid} />
            </FieldContainer>
        {/if}

    <FieldContainer label="Amount" secondLabel="Value" placeholder="0.0" value={quantity && quantity.toString()} valid={amountValid}>
        <InputAsset name="amount" {availableBalance} bind:value={amount} bind:valid={amountValid} />
    </FieldContainer>

    {#if activeBlockchain.id !== 'fio'}
        <FieldContainer label="Memo (Optional)" placeholder="Add" value={memo} valid={true}>
            <Input name="memo" bind:value={memo} />
        </FieldContainer>
    {/if}
    <div class="button-container">
      <Button size="large" formValidation on:action={handleTransfer}>
        Create Transfer Request
      </Button>
    </div>

    {#if displaySuccessTx}
        <TransactionNotificationSuccess
            tx={displaySuccessTx}
            {activeBlockchain}
            onClose={() => (displaySuccessTx = '')}
        />
    {/if}
</Form>
