<script lang="ts">
    import {Asset} from '@greymass/eosio'
    import {getContext} from 'svelte'
    import {derived} from 'svelte/store'

    import {activeBlockchain, activeSession, currentAccount} from '~/store'
    import {ChainFeatures} from '~/config'
    import {Sellram} from '~/abi-types'

    import Button from '~/components/elements/button.svelte'
    import Segment from '~/components/elements/segment.svelte'
    import InputAsset from '~/components/elements/input/asset.svelte'
    import type {FormTransaction} from '~/ui-types'
    import Form from '~/components/elements/form.svelte'

    $: balance =
        $currentAccount?.core_liquid_balance ||
        Asset.fromUnits(0, $activeBlockchain.coreTokenSymbol)

    const context: FormTransaction = getContext('transaction')

    let kb: string
    let error: string | undefined

    $: loading = $currentAccount

    // Create a derived store of the field we expect to be modified
    export const field = derived([currentAccount], ([$currentAccount]) => {
        if ($currentAccount) {
            return $currentAccount.ram_quota
        }
        return undefined
    })

    async function sellram() {
        try {
            // Perform the transaction
            const result = await $activeSession!.transact({
                actions: [
                    {
                        authorization: [$activeSession!.auth],
                        account: 'eosio',
                        name: 'sellram',
                        data: Sellram.from({
                            account: $activeSession!.auth.actor,
                            bytes: Number(kb) / 1000,
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

<h2 class="header">Sell RAM to the network...</h2>
<Segment color="white">
    {#await loading}
        <p>Hang on, fetching balances and stuff...</p>
    {:then _}
        {#if $activeBlockchain.chainFeatures.has(ChainFeatures.BuyRAM)}
            <Form on:submit={sellram}>
                <p>Amount of kb to sell:</p>
                <InputAsset focus fluid name="kb" bind:value={kb} />
                <Button fluid size="large" formValidation on:action={sellram}
                    >Sell {kb} kb for PRICE</Button
                >
                {#if error}
                    {error}
                {/if}
                <p>Account Balance: {balance}</p>
            </Form>
        {:else}
            <p>This feature is unavailable on this blockchain.</p>
        {/if}
    {/await}
</Segment>
