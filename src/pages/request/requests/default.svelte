<script lang="ts">
    import Button from '~/components/elements/button.svelte'
    import QRCode from '~/components/elements/qrcode.svelte'

    export let transaction: any
    export let session: any
    export let chain: any
    export let request: any
    export let sign: any
</script>

<style>
</style>

<div>
    Generic Component
    <QRCode data={String(request)} />
    {#if chain && session}
        {#if chain.chainId.equals(session.chainId)}
            <Button on:action={sign}>Sign Transaction</Button>
        {:else}
            <p>Switch to an account on {chain.name} to sign this transaction.</p>
        {/if}
    {/if}

    {#if transaction}
        <code>
            <pre>{JSON.stringify(transaction, null, 4)}</pre>
        </code>
    {/if}
</div>
