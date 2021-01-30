<script lang="ts">
    import {Asset, UInt64} from '@greymass/eosio'

    import {activeBlockchain, activeSession, currentAccount} from '~/store'
    import {ChainFeatures} from '~/config'
    import {Stake} from '~/abi-types'

    import Button from '~/components/elements/button.svelte'
    import Form from '~/components/elements/form.svelte'
    import InputAsset from '~/components/elements/input/asset.svelte'

    $: balance =
        $currentAccount?.core_liquid_balance ||
        Asset.fromUnits(0, $activeBlockchain.coreTokenSymbol)

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
                        methods: false,
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
    }
</script>

<style>
</style>

{#await loading}
    <p>Hang on, fetching balances and stuff...</p>
{:then _}
    {#if $activeBlockchain.chainFeatures.has(ChainFeatures.Staking)}
        <Form>
            <p>You have {balance}</p>
            <p>Amount of CPU:</p>
            <InputAsset allowZero name="cpu" bind:value={cpu} />
            <p>Amount of NET:</p>
            <InputAsset allowZero name="net" bind:value={net} />
            <p>The following amounts will be staked:</p>
            <ul>
                <li>to CPU: {amountCPU}</li>
                <li>to NET: {amountNET}</li>
            </ul>
            <Button formValidation on:action={stake}>Stake</Button>
        </Form>
        <ul />
    {:else}
        <p>This feature is unavailable on this blockchain.</p>
    {/if}
{/await}
