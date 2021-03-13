<script lang="ts">
    import {transferData} from './transferData'

    import {activeBlockchain, activeSession} from '~/store'

    import {Step} from './types'

    import InputAccountLookup from '~/components/elements/input/account/lookup.svelte'
    import InputAddress from '~/components/elements/input/address.svelte'
    import Button from '~/components/elements/button.svelte'

    let toAddress: string = $transferData.toAddress || ''
    let toAccount: string = $transferData.toAccount || ''

    let valid: boolean = false

    function handleKeydown(event: any) {
        if (valid && event.key === 'Enter') {
            confirmChange()
        }
    }

    function confirmChange() {
        transferData.update((data) => ({
            ...data,
            toAccount,
            toAddress,
            step: Step.Amount,
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
    <div class="field-container">
        {#if $activeBlockchain && $activeBlockchain.id === 'fio'}
            <InputAddress
                bind:valid
                bind:value={toAddress}
                focus
                fullWidth
                name="to"
                placeholder="recipient address or public key.."
            />
        {:else}
            <InputAccountLookup
                bind:valid
                bind:value={toAccount}
                focus
                fullWidth
                name="to"
                placeholder="recipient account name.."
                activeSession={$activeSession}
            />
        {/if}
    </div>

    <Button size="large" disabled={!valid} on:action={confirmChange}>Continue</Button>
</div>
