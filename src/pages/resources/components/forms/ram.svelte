<script lang="ts">
    import {Asset} from '@greymass/eosio'

    import {activeBlockchain, activeSession, currentAccount} from '~/store'
    import {ChainFeatures} from '~/config'
    import {BuyRamBytes} from '~/abi-types'

    import Button from '~/components/elements/button.svelte'
    import Form from '~/components/elements/form.svelte'
    import Segment from '~/components/elements/segment.svelte'
    import InputAsset from '~/components/elements/input/asset.svelte'

    $: balance =
        $currentAccount?.core_liquid_balance ||
        Asset.fromUnits(0, $activeBlockchain.coreTokenSymbol)

    let bytes: string
    let error: string | undefined

    $: loading = $currentAccount

    async function buyrambytes() {
        try {
            await $activeSession!.transact({
                actions: [
                    {
                        authorization: [$activeSession!.auth],
                        account: 'eosio',
                        name: 'buyrambytes',
                        data: BuyRamBytes.from({
                            payer: $activeSession!.auth.actor,
                            receiver: $activeSession!.auth.actor,
                            bytes: Number(bytes),
                        }),
                    },
                ],
            })
        } catch (e) {
            error = String(e)
        }
    }
</script>

<style>
</style>

<Segment color="white">
    {#await loading}
        <p>Hang on, fetching balances and stuff...</p>
    {:then _}
        {#if $activeBlockchain.chainFeatures.has(ChainFeatures.BuyRAM)}
            <Form>
                <p>Number of <strong>bytes</strong> to buy:</p>
                <InputAsset focus fullWidth name="bytes" bind:value={bytes} />
                <Button fluid size="large" formValidation on:action={buyrambytes}>Buy RAM</Button>
                <p>Account Balance: {balance}</p>
            </Form>
        {:else}
            <p>This feature is unavailable on this blockchain.</p>
        {/if}
    {/await}
</Segment>
