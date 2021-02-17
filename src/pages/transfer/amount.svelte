<script lang="ts">
    import InputAccount from '~/components/elements/input/account.svelte'
    import InputAddress from '~/components/elements/input/address.svelte'

    export let toAccount: string | undefined = undefined
    export let toAddress: string | undefined = undefined
</script>


{#if activeBlockchain.id === 'fio'}
    <h2>Please enter your FIO address or public key</h2>

    <InputAddress name="to" bind:value={toAddress} bind:valid={toAddressValid} />
{:else}
    <h2>Please enter your account name</h2>

    <InputAccount
        name="to"
        {activeSession}
        bind:value={toAccount}
        bind:valid={valid}
    />
{/if}

<Button size="large" disabled={!valid} on:action={handleTransfer}>
  Continue
</Button>
