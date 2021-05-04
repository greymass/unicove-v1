<script lang="ts">
    import {Asset} from '@greymass/eosio'
    import type {Readable, Writable} from 'svelte/store'
    import {derived, writable} from 'svelte/store'

    import {PowerUp} from '~/abi-types'
    import {activeBlockchain, activeSession, currentAccountBalance} from '~/store'
    import {ChainFeatures} from '~/config'

    import {powerupPrice, sampleUsage, statePowerUp} from '~/pages/resources/resources'

    import Button from '~/components/elements/button.svelte'
    import ErrorMessage from '~/components/elements/input/errorMessage.svelte'
    import Form from '~/components/elements/form.svelte'
    import Input from '~/components/elements/input.svelte'
    import Segment from '~/components/elements/segment.svelte'

    export let resource: string = 'cpu'
    const unit = resource === 'cpu' ? 'ms' : 'kb'

    let amount: Writable<string> = writable('0')
    let error: string | undefined

    const cost: Readable<Asset | undefined> = derived(
        [activeBlockchain, amount, powerupPrice],
        ([$activeBlockchain, $amount, $powerupPrice]) => {
            if ($activeBlockchain && $powerupPrice) {
                return Asset.from(
                    Number($powerupPrice.value) * Number($amount),
                    $activeBlockchain.coreTokenSymbol
                )
            }
        }
    )

    async function powerup() {
        try {
            let cpu_frac = 0
            let net_frac = 0
            switch (resource) {
                case 'net': {
                    net_frac = $statePowerUp!.net.frac_by_kb($sampleUsage!, Number(amount))
                    break
                }
                default:
                case 'cpu': {
                    cpu_frac = $statePowerUp!.cpu.frac_by_ms($sampleUsage!, Number(amount))
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
                            max_payment: $cost!,
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

<h2 class="header">Rent {resource.toUpperCase()} from PowerUp</h2>
<Segment color="white">
    {#if $activeBlockchain?.chainFeatures.has(ChainFeatures.PowerUp)}
        <Form on:submit={powerup}>
            <p>Amount of {unit} to rent.</p>
            <Input focus fluid name="amount" bind:value={$amount} />
            <ErrorMessage errorMessage={error} />
            <Button fluid size="large" formValidation on:action={powerup}
                >Rent {Number($amount)}
                {unit} for {$cost}</Button
            >
            <p>Account Balance: {$currentAccountBalance}</p>
        </Form>
    {:else}
        <p>This feature is unavailable on this blockchain.</p>
    {/if}
</Segment>
