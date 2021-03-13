<script lang="ts">
    import {transferData} from './transferData'
    import {activeBlockchain, activeSession} from '~/store'

    import Button from '~/components/elements/button.svelte'
    import Input from '~/components/elements/input.svelte'
    import InputAccountLookup from '~/components/elements/input/account/lookup.svelte'
    import InputAddress from '~/components/elements/input/address.svelte'
    import InputAsset from '~/components/elements/input/asset.svelte'
    import Form from '~/components/elements/form.svelte'
    import FieldContainer from './fieldContainer.svelte'

    export let availableBalance: number | undefined = undefined
    export let handleTransfer: () => Promise<void>
    export let quantity: Asset | undefined = undefined

    let toAccount: string | undefined = $transferData.toAccount
    let toAddress: string | undefined = $transferData.toAddress
    let amount: string | undefined = $transferData.amount
    let memo: string | undefined = $transferData.memo

    let toAccountValid: boolean = false
    let toAddressValid: boolean = false
    let amountValid: boolean = false

    async function confirmTransaction() {
        transferData.update((data) => ({
            ...data,
            toAccount,
            toAddress,
            amount,
            memo,
        }))

        handleTransfer()
    }
</script>

<style type="scss">
    .button-container {
        display: flex;
        flex-direction: column;
        margin: 20px 0;
    }
</style>

<Form>
    {#if $activeBlockchain && $activeBlockchain.id === 'fio'}
        <FieldContainer
            label="To"
            secondLabel="Recipient"
            placeholder="select"
            valid={toAddressValid}
            value={toAddress}
        >
            <InputAddress name="to" bind:value={toAddress} bind:valid={toAddressValid} />
        </FieldContainer>
    {:else}
        <FieldContainer
            label="To"
            secondLabel="Recipient"
            placeholder="select"
            valid={toAccountValid}
            value={toAccount}
        >
            <InputAccountLookup
                name="to"
                activeSession={$activeSession}
                bind:value={toAccount}
                bind:valid={toAccountValid}
            />
        </FieldContainer>
    {/if}

    <FieldContainer
        label="Amount"
        secondLabel="Value"
        placeholder="0.0"
        value={(quantity && quantity.toString()) || ''}
        valid={amountValid}
    >
        <InputAsset
            name="amount"
            nonZero
            {availableBalance}
            bind:value={amount}
            bind:valid={amountValid}
        />
    </FieldContainer>

    {#if $activeBlockchain && $activeBlockchain.id !== 'fio'}
        <FieldContainer
            label="Memo"
            secondLabel="(Optional)"
            placeholder="Add"
            value={memo}token-balances-ticker
            valid
            optional
        >
            <Input name="memo" bind:value={memo} />
        </FieldContainer>
    {/if}
    <div class="button-container">
        <Button size="large" formValidation on:action={confirmTransaction}>
            Create Transfer Request
        </Button>
    </div>
</Form>
