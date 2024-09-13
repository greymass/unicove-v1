<script lang="ts">
    import {Asset} from 'anchor-link'
    import {getContext} from 'svelte'
    import type {Readable, Writable} from 'svelte/store'
    import {derived, writable} from 'svelte/store'

    import {PowerUp} from '~/abi-types'
    import {ChainFeatures} from '~/config'
    import {activeBlockchain, activeSession, currentAccount} from '~/store'
    import {systemToken} from '~/stores/tokens'
    import {systemTokenBalance} from '~/stores/balances'
    import {cpuPowerupPrice, netPowerupPrice, sampleUsage, statePowerUp} from '~/pages/resources/resources'

    import type {FormTransaction} from '~/ui-types'
    import Button from '~/components/elements/button.svelte'
    import Form from '~/components/elements/form.svelte'
    import FormBalance from '~/components/elements/form/balance.svelte'
    import Input from '~/components/elements/input.svelte'
    import InputErrorMessage from '~/components/elements/input/errorMessage.svelte'
    import Segment from '~/components/elements/segment.svelte'

    const context: FormTransaction = getContext('transaction')

    export let resource: string = 'cpu'
    const unit = resource === 'cpu' ? 'ms' : 'kb'
    const powerupPrice = resource === 'cpu' ? cpuPowerupPrice : netPowerupPrice

    let amount: Writable<string> = writable('')
    let error: string | undefined

    const {PowerUp: PowerUpFeature} = ChainFeatures

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

    // Create a derived store of the field we expect to be modified
    export const field = derived([currentAccount], ([$currentAccount]) => {
        if ($currentAccount && $currentAccount.self_delegated_bandwidth) {
            switch (resource) {
                case 'net': {
                    return $currentAccount.net_limit.max
                }
                case 'cpu':
                default: {
                    return $currentAccount.cpu_limit.max
                }
            }
        }
        return undefined
    })

    async function powerup() {
        try {
            let cpu_frac = 0
            let net_frac = 0
            switch (resource) {
                case 'net': {
                    net_frac = $statePowerUp!.net.frac_by_kb($sampleUsage!, Number($amount))
                    break
                }
                default:
                case 'cpu': {
                    cpu_frac = $statePowerUp!.cpu.frac_by_ms($sampleUsage!, Number($amount))
                    break
                }
            }
            const result = await $activeSession!.transact({
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

<Segment background="white">
    {#if $activeBlockchain?.chainFeatures.has(PowerUpFeature)}
        <Form on:submit={powerup}>
            <p>Amount of {unit} to rent from PowerUp.</p>
            <Input
                focus
                fluid
                inputmode="decimal"
                name="amount"
                placeholder={`number of ${unit}`}
                bind:value={$amount}
            />
            {#if $systemToken}
                <FormBalance token={$systemToken} balance={systemTokenBalance} />
            {/if}
            <InputErrorMessage errorMessage={error} />
            <Button fluid size="large" formValidation on:action={powerup}
                >Rent {Number($amount)}
                {unit} for {$cost}</Button
            >
        </Form>
    {:else}
        <p>This feature is unavailable on this blockchain.</p>
    {/if}
</Segment>
