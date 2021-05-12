<script lang="ts">
    import {Asset} from '@greymass/eosio'

    import type {Balance} from '~/stores/balances'
    import type {Token} from '~/stores/tokens'

    import InputAsset from '~/components/elements/input/asset.svelte'
    import Button from '~/components/elements/button.svelte'
    import Form from '~/components/elements/form.svelte'

    import {transferData, Step} from '~/pages/transfer/transfer'
    import StatusBalance from '~/pages/transfer/status/balance.svelte'
    import type {Readable} from 'svelte/store'

    export let balance: Readable<Balance | undefined>
    export let token: Token

    let amount: string = String(($transferData.quantity && $transferData.quantity.value) || '')
    let amountValid: boolean = false

    function confirmChange() {
        transferData.update((data) => ({
            ...data,
            quantity: Asset.from(Number(amount), token.symbol),
            step: data.backStep || Step.Confirm,
            backStep: undefined,
        }))
    }
</script>

<style type="scss">
</style>

<div class="container">
    {#if $balance}
        <Form on:submit={confirmChange}>
            <InputAsset
                bind:valid={amountValid}
                bind:value={amount}
                focus
                fluid
                name="amount"
                placeholder={`Enter the amount of tokens to send to ${$transferData.toAccount}`}
                balance={$balance.quantity}
            />
            <StatusBalance {token} {balance} />
        </Form>
    {/if}
    <Button
        fluid
        primary
        size="large"
        disabled={!amountValid}
        formValidation
        on:action={confirmChange}
    >
        Continue
    </Button>
</div>
