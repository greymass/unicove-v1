<script lang="ts">
    import {Asset} from '@greymass/eosio'
    import {getContext} from 'svelte'
    import {derived} from 'svelte/store'

    import {activeBlockchain, activeSession, currentAccount} from '~/store'
    import {ChainFeatures} from '~/config'
    import {BuyRamBytes} from '~/abi-types'

    import Button from '~/components/elements/button.svelte'
    import Segment from '~/components/elements/segment.svelte'
    import InputAsset from '~/components/elements/input/asset.svelte'
    import type {FormTransaction} from '~/ui-types'

    $: balance =
        $currentAccount?.core_liquid_balance ||
        Asset.fromUnits(0, $activeBlockchain.coreTokenSymbol)

    const context: FormTransaction = getContext('transaction')

    let bytes: string
    let error: string | undefined

    $: loading = $currentAccount

    // Create a derived store of the field we expect to be modified
    export const field = derived([currentAccount], ([$currentAccount]) => {
        if ($currentAccount) {
            console.log($currentAccount.ram_quota)
            return $currentAccount.ram_quota
        }
        return undefined
    })

    async function buyrambytes() {
        try {
            // Perform the transaction
            const result = await $activeSession!.transact({
                actions: [
                    {
                        authorization: [$activeSession!.auth],
                        account: 'eosio',
                        name: 'buyrambytes',
                        data: BuyRamBytes.from({
                            payer: $activeSession!.auth.actor,
                            receiver: $activeSession!.auth.actor,
                            bytes: Number(bytes) * 1000,
                        }),
                    },
                ],
            })

            // If the context exists and this is part of a FormTransaction
            if (context) {
                // Pass the transaction ID to the parent
                const txid = String(result.transaction.id)
                context.setTransaction(txid)

                // Await an update on the field expected for this transaction
                context.awaitAccountUpdate(field)
            }
        } catch (e) {
            error = String(e)
        }
    }
</script>

<style>
</style>

<h2>Purchase RAM from the network...</h2>
<Segment color="white">
    {#await loading}
        <p>Hang on, fetching balances and stuff...</p>
    {:then _}
        {#if $activeBlockchain.chainFeatures.has(ChainFeatures.BuyRAM)}
            <p>Amount to purchase:</p>
            <InputAsset focus fullWidth name="bytes" bind:value={bytes} />
            <Button fluid size="large" formValidation on:action={buyrambytes}>Buy RAM</Button>
            {#if error}
                {error}
            {/if}
            <p>Account Balance: {balance}</p>
        {:else}
            <p>This feature is unavailable on this blockchain.</p>
        {/if}
    {/await}
</Segment>
