<script lang="ts">
    import {activeBlockchain} from '~/store'
    import type {Token} from '~/stores/tokens'

    import Button from '~/components/elements/button.svelte'
    import Icon from '~/components/elements/icon.svelte'
    import Text from '~/components/elements/text.svelte'
    import Form from '~/components/elements/form.svelte'

    import {transferData} from '~/pages/transfer/transfer'
    import {txFee} from '~/pages/transfer/fio'
    import StatusToken from '~/pages/transfer/status/token.svelte'
    import StatusAddress from '~/pages/transfer/status/address.svelte'
    import StatusAccount from '~/pages/transfer/status/account.svelte'
    import StatusQuantity from '~/pages/transfer/status/quantity.svelte'
    import StatusMemo from '~/pages/transfer/status/memo.svelte'
    import StatusFee from '~/pages/transfer/status/fee.svelte'

    export let token: Token

    export let handleTransfer: () => Promise<void>

    let memo: string | undefined = $transferData.memo

    async function confirmTransaction() {
        transferData.update((data) => ({
            ...data,
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
    <StatusToken {token} />
    {#if $transferData.toAddress}
        <StatusAddress toAddress={$transferData.toAddress} />
    {/if}
    {#if $transferData.toAccount}
        <StatusAccount toAccount={$transferData.toAccount} />
    {/if}
    {#if $transferData.quantity}
        <StatusQuantity quantity={$transferData.quantity} />
    {/if}
    {#if $transferData.quantity && $txFee}
        <StatusFee txFee={$txFee} quantity={$transferData.quantity} />
    {/if}
    {#if $activeBlockchain && $activeBlockchain.id !== 'fio'}
        <StatusMemo memo={$transferData.memo} />
    {/if}
    <div class="button-container">
        <Button primary size="large" formValidation on:action={confirmTransaction}>
            <Icon name="edit-3" />
            <Text>Sign Transaction</Text>
        </Button>
    </div>
</Form>
