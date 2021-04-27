<script lang="ts">
    import {Asset} from '@greymass/eosio'

    import type {Balance} from '~/stores/balances'
    import type {Token} from '~/stores/tokens'

    import InputAsset from '~/components/elements/input/asset.svelte'
    import Button from '~/components/elements/button.svelte'
    import Form from '~/components/elements/form.svelte'

    import {transferData, Step} from '~/pages/transfer/transfer'
    import StatusAddress from '~/pages/transfer/status/address.svelte'
    import StatusAccount from '~/pages/transfer/status/account.svelte'
    import StatusBalance from '~/pages/transfer/status/balance.svelte'
    import StatusToken from '~/pages/transfer/status/token.svelte'

    export let balance: Balance
    export let token: Token

    let amount: string = String($transferData.quantity || '')
    let amountValid: boolean = false

    function confirmChange() {
        transferData.update((data) => ({
            ...data,
            quantity: Asset.from(Number(amount), token.symbol),
            step: Step.Confirm,
        }))
    }
</script>

<style type="scss">
    :global(form) {
        margin: 1em 0;
    }
</style>

<div class="container">
    <StatusToken {token} />
    {#if $transferData.toAddress}
        <StatusAddress toAddress={$transferData.toAddress} />
    {/if}
    {#if $transferData.toAccount}
        <StatusAccount toAccount={$transferData.toAccount} />
    {/if}
    <StatusBalance {balance} />
    <Form on:submit={confirmChange}>
        <InputAsset
            bind:valid={amountValid}
            bind:value={amount}
            focus
            fluid
            name="amount"
            placeholder="amount to be transfered.."
            balance={balance.quantity}
        />
    </Form>
    <Button
        fluid
        primary
        size="large"
        disabled={!amountValid}
        formValidation
        on:action={confirmChange}
    >
        Send {amount}
        {token.name}
        {#if $transferData.toAccount}
            to {$transferData.toAccount}
        {/if}
    </Button>
</div>
