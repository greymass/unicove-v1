<script lang="ts">
    import type {API, LinkSession} from 'anchor-link'
    import {Asset} from '@greymass/eosio'

    import {activeBlockchain, activeSession, currentAccount} from '~/store'
    import {ChainFeatures} from '~/config'

    import {powerupPrice, sampleUsage, statePowerUp} from '~/pages/resources/resources'

    import Button from '~/components/elements/button.svelte'
    import Form from '~/components/elements/form.svelte'
    import Input from '~/components/elements/input.svelte'
    import Segment from '~/components/elements/segment.svelte'

    import {PowerUp} from '~/abi-types'

    export let resource = 'cpu'

    let account: API.v1.AccountObject

    $: loading = $currentAccount

    let amount: string = '1'
    let cost = Number($powerupPrice) * Number(amount)

    $: balance =
        $currentAccount?.core_liquid_balance ||
        Asset.fromUnits(0, $activeBlockchain.coreTokenSymbol)

    $: {
        cost = Number($powerupPrice.value) * Number(amount)
    }

    async function powerup() {
        let cpu_frac = 0
        let net_frac = 0
        if (!$statePowerUp) {
            throw new Error('PowerUp state not loaded.')
        }
        if (!$sampleUsage) {
            throw new Error('Usage sample required.')
        }
        switch (resource) {
            case 'net': {
                net_frac = $statePowerUp.net.frac_by_kb($sampleUsage, Number(amount))
                break
            }
            default:
            case 'cpu': {
                cpu_frac = $statePowerUp.cpu.frac_by_ms($sampleUsage, Number(amount))
                break
            }
        }
        await $activeSession!.transact({
            actions: [
                {
                    authorization: [$activeSession!.auth],
                    account: 'eosio',
                    name: 'powerup',
                    data: PowerUp.from({
                        payer: $activeSession!.auth.actor,
                        receiver: $activeSession!.auth.actor,
                        days: 1,
                        net_frac,
                        cpu_frac,
                        max_payment: Asset.from(cost, '4,EOS'),
                    }),
                },
            ],
        })
    }
</script>

<style>
</style>

<Segment color="white">
    {#await loading}
        <p>Hang on, fetching balances and stuff...</p>
    {:then _}
        {#if $activeBlockchain.chainFeatures.has(ChainFeatures.PowerUp)}
            <Form>
                <p>
                    Enter the number of <strong>{resource === 'cpu' ? 'ms' : 'kb'}</strong> you would
                    like to rent.
                </p>
                <Input name="amount" bind:value={amount} />
                <p>Cost: {cost}</p>
                <p>Balance: {balance}</p>
                <Button formValidation on:action={powerup}>Rent</Button>
            </Form>
        {:else}
            <p>This feature is unavailable on this blockchain.</p>
        {/if}
    {/await}
</Segment>
