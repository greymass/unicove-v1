<script lang="ts">
    import {Asset} from '@greymass/eosio'

    import {activeBlockchain, activeSession, currentAccount} from '~/store'
    import {ChainFeatures} from '~/config'
    import {BuyRamBytes} from '~/abi-types'

    import Button from '~/components/elements/button.svelte'
    import Form from '~/components/elements/form.svelte'
    import InputAsset from '~/components/elements/input/asset.svelte'

    $: balance =
        $currentAccount?.core_liquid_balance ||
        Asset.fromUnits(0, $activeBlockchain.coreTokenSymbol)

    let bytes: string = '0'
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

{#await loading}
    <p>Hang on, fetching balances and stuff...</p>
{:then _}
    {#if $activeBlockchain.chainFeatures.has(ChainFeatures.BuyRAM)}
        <Form>
            <p>You have {balance}</p>
            <p>Number of bytes to buy:</p>
            <InputAsset name="bytes" bind:value={bytes} />
            <Button formValidation on:action={buyrambytes}>Buy RAM</Button>
        </Form>
        <ul />
    {:else}
        <p>This feature is unavailable on this blockchain.</p>
    {/if}
{/await}
