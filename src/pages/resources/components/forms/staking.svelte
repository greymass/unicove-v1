<script lang="ts">
    import {Asset, UInt64} from '@greymass/eosio'

    import {activeBlockchain, activeSession, currentAccount} from '~/store'
    import {ChainFeatures} from '~/config'
    import {Stake} from '~/abi-types'

    import Button from '~/components/elements/button.svelte'
    import Form from '~/components/elements/form.svelte'
    import Segment from '~/components/elements/segment.svelte'
    import InputAsset from '~/components/elements/input/asset.svelte'

    $: balance =
        $currentAccount?.core_liquid_balance ||
        Asset.fromUnits(0, $activeBlockchain.coreTokenSymbol)

    export let resource = 'cpu'
    let error: string | undefined
    let cpu: string = '0'
    let net: string = '0'

    let amountCPU = Asset.fromFloat(parseFloat(cpu), $activeBlockchain.coreTokenSymbol)
    let amountNET = Asset.fromFloat(parseFloat(net), $activeBlockchain.coreTokenSymbol)

    $: loading = $currentAccount

    $: {
        let parsedCPU = parseFloat(cpu)
        let parsedNET = parseFloat(net)
        amountCPU = Asset.fromFloat(parsedCPU, $activeBlockchain.coreTokenSymbol)
        amountNET = Asset.fromFloat(parsedNET, $activeBlockchain.coreTokenSymbol)
    }

    async function stake() {
        try {
            await $activeSession!.transact({
                actions: [
                    {
                        authorization: [$activeSession!.auth],
                        account: 'eosio',
                        name: 'delegatebw',
                        data: Stake.from({
                            from: $activeSession!.auth.actor,
                            receiver: $activeSession!.auth.actor,
                            stake_net_quantity: amountNET,
                            stake_cpu_quantity: amountCPU,
                            transfer: false,
                        }),
                    },
                ],
            })
            // adjust balance to reflect staking operation
            balance.units = UInt64.from(
                balance.units.toNumber() -
                    Asset.from(amountNET).units.toNumber() -
                    Asset.from(amountCPU).units.toNumber()
            )
        } catch (e) {
            error = String(e)
        }
    }
</script>

<style>
</style>

<h2 class="header">Stake {resource.toUpperCase()} tokens to the network...</h2>
<Segment color="white">
    {#await loading}
        <p>Hang on, fetching balances and stuff...</p>
    {:then _}
        {#if $activeBlockchain.chainFeatures.has(ChainFeatures.Staking)}
            <Form on:submit={stake}>
                {#if resource === 'cpu'}
                    <p>Amount of EOS to stake as CPU:</p>
                    <InputAsset allowZero fluid name="cpu" bind:value={cpu} />
                {/if}
                {#if resource === 'net'}
                    <p>Amount of EOS to stake as NET:</p>
                    <InputAsset allowZero fluid name="net" bind:value={net} />
                {/if}
                <Button fluid size="large" formValidation on:action={stake}>Stake Tokens</Button>
                {error}
                <p>Account Balance: {balance}</p>
            </Form>
            <ul />
        {:else}
            <p>This feature is unavailable on this blockchain.</p>
        {/if}
    {/await}
</Segment>
