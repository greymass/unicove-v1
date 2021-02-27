<script lang="ts">
    import type {ChainConfig} from '~/config'
    import type {LinkSession} from 'anchor-link'
    import type {TransferData} from '../transfer'

    import {getContext} from 'svelte'

    import InputAsset from '~/components/elements/input/asset.svelte'
    import InputAddress from '~/components/elements/input/address.svelte'
    import InputAccount from '~/components/elements/input/account.svelte'
    import Button from '~/components/elements/button.svelte'
    import FieldContainer from './fieldContainer.svelte'

    export let availableBalance: number | undefined

    const transferData: SvelteStore<TransferData> = getContext('transferData')

    console.log({inAmount: $transferData})

    // const {
    //     amount: string | undefined,
    //     toAddress: string | undefined,
    //     toAccount: string | undefined,
    //
    // } = $transferData

    let toAddress
    let amount
    let toAccount

    export let activeBlockchain: ChainConfig
    export let activeSession: LinkSession

    let toAccountValid: boolean = false
    let toAddressValid: boolean = false
    let amountValid: boolean = false

    function handleKeydown(event: any) {
        if (amountValid && event.key === 'Enter') {
            step = 'confirm'
        }
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
    <div class="field-container">
        <InputAsset
            bind:valid={amountValid}
            bind:value={amount}
            focus
            fullWidth
            name="amount"
            placeholder="amount to be transfered.."
            {availableBalance}
        />
    </div>
    <Button size="large" disabled={!amountValid} on:action={() => (step = 'confirm')}
        >Continue</Button
    >
</div>
