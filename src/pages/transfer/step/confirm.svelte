<script lang="ts">
    import {activeBlockchain} from '~/store'

    import Button from '~/components/elements/button.svelte'
    import Icon from '~/components/elements/icon.svelte'
    import Text from '~/components/elements/text.svelte'
    import Input from '~/components/elements/input.svelte'

    import {transferData} from '~/pages/transfer/transfer'
    import {txFee} from '~/pages/transfer/fio'
    import StatusAddress from '~/pages/transfer/status/address.svelte'
    import StatusAccount from '~/pages/transfer/status/account.svelte'
    import StatusQuantity from '~/pages/transfer/status/quantity.svelte'
    import StatusFee from '~/pages/transfer/status/fee.svelte'

    export let handleTransfer: () => void

    let memo: string = ''

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            handleConfirm();
        }
    }

    function handleConfirm() {
       transferData.update((data) => ({
          ...data,
          memo,
       }))

       handleTransfer()
    }
</script>

<style type="scss">
</style>

<svelte:window on:keydown={handleKeydown} />
{#if $transferData.toAddress}
    <StatusAddress editable toAddress={$transferData.toAddress} />
{/if}
{#if $transferData.toAccount}
    <StatusAccount editable toAccount={$transferData.toAccount} />
{/if}
{#if $transferData.quantity}
    <StatusQuantity editable quantity={$transferData.quantity} />
{/if}
{#if $transferData.quantity && $txFee}
    <StatusFee txFee={$txFee} quantity={$transferData.quantity} />
{/if}
{#if $activeBlockchain && $activeBlockchain.id !== 'fio'}
    <label>Memo (Optional)</label>
    <Input
        name="memo"
        focus
        fluid
        bind:value={memo}
        placeholder="Memo"
    />
{/if}
<Button fluid primary size="large" formValidation on:action={handleConfirm}>
    <Icon name="edit-3" />
    <Text>Sign Transaction</Text>
</Button>
