<script lang="ts">
    import {Step} from './types'

    import {transferData} from './transferData'

    import {activeBlockchain, activeSession} from '~/store'

    import InputAsset from '~/components/elements/input/asset.svelte'
    import InputAddress from '~/components/elements/input/address.svelte'
    import InputAccountLookup from '~/components/elements/input/account/lookup.svelte'
    import Button from '~/components/elements/button.svelte'
    import FieldContainer from './fieldContainer.svelte'

    export let availableBalance: number | undefined

    let toAddress: string = $transferData.toAddress || ''
    let toAccount: string = $transferData.toAccount || ''
    let amount: string = $transferData.amount || ''

    let toAccountValid: boolean = true
    let toAddressValid: boolean = true
    let amountValid: boolean = false

    function handleKeydown(event: any) {
        if (amountValid && event.key === 'Enter') {
            confirmChange()
        }
    }

    function confirmChange() {
        transferData.update((data) => ({
            ...data,
            toAccount,
            toAddress,
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

<svelte:window on:keydown={handleKeydown} />

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
            <InputAccountLookup
                name="to"
                activeSession={$activeSession}
                bind:value={toAccount}
                bind:valid={toAccountValid}
            />
        </FieldContainer>
    {/if}
    <div class="field-container">
        <InputAsset
            bind:valid={amountValid}
            bind:value={amount}
            focus
            fullWidth
            nonZero
            name="amount"
            placeholder="amount to be transfered.."
            {availableBalance}
        />
    </div>
    <Button size="large" disabled={!amountValid} on:action={confirmChange}>Continue</Button>
</div>
