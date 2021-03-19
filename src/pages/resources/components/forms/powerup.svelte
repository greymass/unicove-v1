<script lang="ts">
    import {Asset} from '@greymass/eosio'

    import {activeBlockchain, activeSession, currentAccount} from '~/store'
    import {ChainFeatures} from '~/config'

    import {powerupPrice, sampleUsage, statePowerUp} from '~/pages/resources/resources'

    import Button from '~/components/elements/button.svelte'
    import ErrorMessage from '~/components/elements/input/errorMessage.svelte'
    import Form from '~/components/elements/form.svelte'
    import Input from '~/components/elements/input.svelte'
    import Segment from '~/components/elements/segment.svelte'

    import {PowerUp} from '~/abi-types'

    export let resource: string = 'cpu'

    $: loading = $currentAccount

    let amount: string
    let cost = Number($powerupPrice) * Number(amount)
    let error: string | undefined

    $: balance =
        $currentAccount?.core_liquid_balance ||
        Asset.fromUnits(0, $activeBlockchain.coreTokenSymbol)

    $: {
        cost = Number($powerupPrice.value) * Number(amount)
    }

    async function powerup() {
        try {
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
        {#if $activeBlockchain.chainFeatures.has(ChainFeatures.PowerUp)}
            <Form>
                <p>
                    Number of <strong>{resource === 'cpu' ? 'ms' : 'kb'}</strong> to rent.
                </p>
                <Input focus fullWidth name="amount" bind:value={amount} />
                <ErrorMessage errorMessage={error} />
                <Button fluid size="large" formValidation on:action={powerup}
                    >Rent for {Asset.from(cost, $activeBlockchain.coreTokenSymbol)}</Button
                >
                <p>Account Balance: {balance}</p>
            </Form>
        {:else}
            <p>This feature is unavailable on this blockchain.</p>
        {/if}
    {/await}
</Segment>
