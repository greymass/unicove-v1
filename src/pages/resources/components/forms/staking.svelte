<script lang="ts">
    import {Asset} from '@greymass/eosio'

    import {activeBlockchain, activeSession, currentAccountBalance} from '~/store'
    import {ChainFeatures} from '~/config'
    import {Stake} from '~/abi-types'

    import Button from '~/components/elements/button.svelte'
    import ErrorMessage from '~/components/elements/input/errorMessage.svelte'
    import Form from '~/components/elements/form.svelte'
    import Segment from '~/components/elements/segment.svelte'
    import InputAsset from '~/components/elements/input/asset.svelte'

    export let resource = 'cpu'

    let error: string | undefined
    let cpu: string = '0'
    let net: string = '0'

    let amountCPU = Asset.fromFloat(parseFloat(cpu), $activeBlockchain!.coreTokenSymbol)
    let amountNET = Asset.fromFloat(parseFloat(net), $activeBlockchain!.coreTokenSymbol)

    $: {
        let parsedCPU = parseFloat(cpu)
        let parsedNET = parseFloat(net)
        amountCPU = Asset.fromFloat(parsedCPU, $activeBlockchain!.coreTokenSymbol)
        amountNET = Asset.fromFloat(parsedNET, $activeBlockchain!.coreTokenSymbol)
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
        } catch (e) {
            error = String(e)
        }
    }
</script>

<style>
</style>

<h2 class="header">Stake {resource.toUpperCase()} tokens to the network...</h2>
<Segment color="white">
    {#if $activeBlockchain?.chainFeatures.has(ChainFeatures.Staking)}
        <Form on:submit={stake}>
            {#if resource === 'cpu'}
                <p>Amount of EOS to stake as CPU:</p>
                <InputAsset allowZero fluid name="cpu" bind:value={cpu} />
            {/if}
            {#if resource === 'net'}
                <p>Amount of EOS to stake as NET:</p>
                <InputAsset allowZero fluid name="net" bind:value={net} />
            {/if}
            <ErrorMessage errorMessage={error} />
            <Button fluid size="large" formValidation on:action={stake}>Stake Tokens</Button>
            <p>Account Balance: {$currentAccountBalance}</p>
        </Form>
        <ul />
    {:else}
        <p>This feature is unavailable on this blockchain.</p>
    {/if}
</Segment>
