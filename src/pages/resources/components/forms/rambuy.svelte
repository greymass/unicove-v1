<script lang="ts">
    import {getContext} from 'svelte'
    import {derived} from 'svelte/store'

    import {activeBlockchain, activeSession, currentAccount, currentAccountBalance} from '~/store'
    import {ChainFeatures} from '~/config'
    import {BuyRamBytes} from '~/abi-types'

    import Button from '~/components/elements/button.svelte'
    import ErrorMessage from '~/components/elements/input/errorMessage.svelte'
    import Form from '~/components/elements/form.svelte'
    import Segment from '~/components/elements/segment.svelte'
    import InputAsset from '~/components/elements/input/asset.svelte'
    import type {FormTransaction} from '~/ui-types'

    const context: FormTransaction = getContext('transaction')

    let kb: string
    let error: string | undefined

    // Create a derived store of the field we expect to be modified
    export const field = derived([currentAccount], ([$currentAccount]) => {
        if ($currentAccount) {
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

<h2 class="header">Buy RAM from the network...</h2>
<Segment color="white">
    {#if $activeBlockchain?.chainFeatures.has(ChainFeatures.BuyRAM)}
        <Form on:submit={buyrambytes}>
            <p>Amount of kb to buy:</p>
            <InputAsset focus fluid name="kb" bind:value={kb} />
            <ErrorMessage errorMessage={error} />
            <Button fluid size="large" formValidation on:action={buyrambytes}
                >Buy {kb} kb for PRICE</Button
            >
            <p>Account Balance: {$currentAccountBalance}</p>
        </Form>
    {:else}
        <p>This feature is unavailable on this blockchain.</p>
    {/if}
</Segment>
