<script lang="ts">
    import type {ChainConfig} from '~/config'
    import type {Asset, LinkSession} from 'anchor-link'

    import {transfer} from '../../services/eosio/methods'

    import Button from '~/components/elements/button.svelte'
    import Input from '~/components/elements/input.svelte'
    import InputAccount from '~/components/elements/input/account.svelte'
    import InputAddress from '~/components/elements/input/address.svelte'
    import InputAsset from '~/components/elements/input/asset.svelte'
    import Form from '~/components/elements/form.svelte'
    import Modal from '~/components/elements/modal.svelte'
    import TransactionNotificationSuccess from '~/components/elements/notification/transaction/success.svelte'
    import FieldContainer from './form/fieldContainer.svelte'

    export let activeBlockchain: ChainConfig
    export let activeSession: LinkSession
    export let toAddress: string | undefined = undefined
    export let toAccount: string | undefined = undefined
    export let amount: string | undefined = undefined
    export let quantity: Asset | undefined = undefined
    export let memo: string | undefined = undefined
    export let availableBalance: number | undefined = undefined
    export let txFee: Asset | undefined = undefined

    let toAccountValid: boolean = false
    let toAddressValid: boolean = false
    let amountValid: boolean = false

    let displaySuccessTx: string | undefined = undefined

    async function handleTransfer() {
        const transferData: any = await transfer(activeBlockchain, activeSession, {
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
        value={quantity && quantity.toString()}
        valid={amountValid}
    >
        <InputAsset name="amount" {availableBalance} bind:value={amount} bind:valid={amountValid} />
    </FieldContainer>

    {#if activeBlockchain.id !== 'fio'}
        <FieldContainer label="Memo (Optional)" placeholder="Add" value={memo} valid optional>
            <Input name="memo" bind:value={memo} />
        </FieldContainer>
    {/if}
    <div class="button-container">
        <Button size="large" formValidation on:action={handleTransfer}>
            Create Transfer Request
        </Button>
    </div>

    <Modal opened={!!displaySuccessTx}>
        <TransactionNotificationSuccess tx={displaySuccessTx} {activeBlockchain} />
    </Modal>
</Form>
