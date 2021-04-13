<script lang="ts">
    import {Asset, Name, PublicKey} from '@greymass/eosio'
    import {Step} from './types'

    import {transferData} from './transferData'

    import {activeBlockchain, activeSession} from '~/store'

    import InputAsset from '~/components/elements/input/asset.svelte'
    import InputAddress from '~/components/elements/input/address.svelte'
    import InputAccountLookup from '~/components/elements/input/account/lookup.svelte'
    import Button from '~/components/elements/button.svelte'
    import Form from '~/components/elements/form.svelte'
    import FieldContainer from './fieldContainer.svelte'
    import TransferBalance from './balance.svelte'

    export let balance: Asset

    let toAddress: string = String($transferData.toAddress || '')
    let toAccount: string = String($transferData.toAccount || '')
    let amount: string = String($transferData.amount || '')

    let toAccountValid: boolean = true
    let toAddressValid: boolean = true
    let amountValid: boolean = false

    function confirmChange() {
        transferData.update((data) => ({
            ...data,
            toAccount: toAccount && toAccount.length > 0 ? Name.from(toAccount) : undefined,
            toAddress: toAddress && toAddress.length > 0 ? PublicKey.from(toAddress) : undefined,
            amount,
            step: Step.Confirm,
        }))
    }
</script>

<style type="scss">
    .container {
        display: flex;
        flex-direction: column;
        border-top: 1px solid var(--divider-grey);

        .field-container {
            margin: 20px 0;
        }
    }
</style>

<div class="container">
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
            <InputAccountLookup name="to" activeSession={$activeSession} bind:value={toAccount} />
        </FieldContainer>
    {/if}
    <Form on:submit={confirmChange}>
        <div class="field-container">
            <TransferBalance {balance} />
            <InputAsset
                bind:valid={amountValid}
                bind:value={amount}
                focus
                fluid
                name="amount"
                placeholder="amount to be transfered.."
                {balance}
            />
        </div>
    </Form>
    <Button primary size="large" disabled={!amountValid} on:action={confirmChange}
        >Send {amount}</Button
    >
</div>
