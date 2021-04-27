<script lang="ts">
    import type {Token} from '~/stores/tokens'

    import Button from '~/components/elements/button.svelte'
    import Form from '~/components/elements/form.svelte'
    import Input from '~/components/elements/input.svelte'

    import {transferData, Step} from '~/pages/transfer/transfer'
    import StatusToken from '~/pages/transfer/status/token.svelte'
    import StatusAddress from '~/pages/transfer/status/address.svelte'
    import StatusAccount from '~/pages/transfer/status/account.svelte'
    import StatusQuantity from '~/pages/transfer/status/quantity.svelte'

    let memo: string = String($transferData.memo || '')
    export let token: Token

    function confirmChange() {
        transferData.update((data) => ({
            ...data,
            memo,
            step: Step.Confirm,
        }))
    }
</script>

<style type="scss">
</style>

<div class="container">
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
    <Form on:submit={confirmChange}>
        <p>Specify a memo for this transfer.</p>
        <Input name="memo" focus fluid bind:value={memo} />
        <Button primary size="large" fluid formValidation on:action={confirmChange}>
            {#if memo}
                Set Memo
            {:else}
                Continue without Memo
            {/if}
        </Button>
    </Form>
</div>
