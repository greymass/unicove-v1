<script lang="ts">
    import type {ChainConfig} from '~/config'
    import {Asset, UInt64} from 'anchor-link'
    import type {ABISerializable, LinkSession} from 'anchor-link'

    import {quantity, transferData} from './transferData'

    import {FIOTransfer, Transfer} from '~/abi-types'

    import Button from '~/components/elements/button.svelte'
    import Input from '~/components/elements/input.svelte'
    import InputAccount from '~/components/elements/input/account.svelte'
    import InputAddress from '~/components/elements/input/address.svelte'
    import InputAsset from '~/components/elements/input/asset.svelte'
    import Form from '~/components/elements/form.svelte'
    import TransactionNotificationSuccess from '~/components/elements/notification/transaction/success.svelte'
    import FieldContainer from './fieldContainer.svelte'

    export let activeBlockchain: ChainConfig
    export let activeSession: LinkSession
    export let availableBalance: number | undefined = undefined
    export let txFee: Asset
    export let handleTransfer: (TransferData) => null

    let toAccount: string | undefined = $transferData.toAccount
    let toAddress: string | undefined = $transferData.toAddress
    let amount: string | undefined = $transferData.amount
    let memo: string | undefined = $transferData.memo

    let toAccountValid: boolean = false
    let toAddressValid: boolean = false
    let amountValid: boolean = false

    async function confirmTransaction() {
        await transferData.update((data) => ({
            ...data,
            toAccount,
            toAddress,
            amount,
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
    {#if activeBlockchain.id === 'fio'}
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
            <InputAccount
                name="to"
                {activeSession}
                bind:value={toAccount}
                bind:valid={toAccountValid}
            />
        </FieldContainer>
    {/if}

    <FieldContainer
        label="Amount"
        secondLabel="Value"
        placeholder="0.0"
        value={$quantity && $quantity.toString()}
        valid={amountValid}
    >
        <InputAsset name="amount" {availableBalance} bind:value={amount} bind:valid={amountValid} />
    </FieldContainer>

    {#if activeBlockchain.id !== 'fio'}
        <FieldContainer
            label="Memo"
            secondLabel="(Optional)"
            placeholder="Add"
            value={memo}
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
