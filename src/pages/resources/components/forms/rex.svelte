<script lang="ts">
    import type {AnyAction} from 'anchor-link'
    import {Asset} from '@greymass/eosio'
    import type {Readable, Writable} from 'svelte/store'
    import {derived, writable} from 'svelte/store'

    import {REXDeposit, REXRentCPU, REXRentNET} from '~/abi-types'
    import {activeBlockchain, activeSession, currentAccount} from '~/store'
    import {ChainFeatures} from '~/config'

    import {rexPrice} from '~/pages/resources/resources'

    import Button from '~/components/elements/button.svelte'
    import ErrorMessage from '~/components/elements/input/errorMessage.svelte'
    import Form from '~/components/elements/form.svelte'
    import Input from '~/components/elements/input.svelte'
    import Segment from '~/components/elements/segment.svelte'

    export let resource = 'cpu'
    const unit = resource === 'cpu' ? 'ms' : 'kb'

    let amount: Writable<string> = writable('0')
    let error: string | undefined

    const balance: Readable<Asset | undefined> = derived(
        [activeBlockchain, currentAccount],
        ([$activeBlockchain, $currentAccount]) => {
            if ($currentAccount) {
                return $currentAccount.core_liquid_balance
            }
            if ($activeBlockchain) {
                return Asset.fromUnits(0, $activeBlockchain.coreTokenSymbol)
            }
        }
    )

    const cost: Readable<Asset | undefined> = derived(
        [activeBlockchain, amount, rexPrice],
        ([$activeBlockchain, $amount, $rexPrice]) => {
            if ($activeBlockchain && $rexPrice) {
                return Asset.from(
                    Number($rexPrice.value) * Number($amount),
                    $activeBlockchain.coreTokenSymbol
                )
            }
        }
    )

    function cpu() {
        return {
            authorization: [$activeSession!.auth],
            account: 'eosio',
            name: 'rentcpu',
            data: REXRentCPU.from({
                from: $activeSession!.auth.actor,
                receiver: $activeSession!.auth.actor,
                loan_payment: cost,
                loan_fund: Asset.fromUnits(0, $activeBlockchain!.coreTokenSymbol),
            }),
        }
    }

    function net() {
        return {
            authorization: [$activeSession!.auth],
            account: 'eosio',
            name: 'rentnet',
            data: REXRentNET.from({
                from: $activeSession!.auth.actor,
                receiver: $activeSession!.auth.actor,
                loan_payment: cost,
                loan_fund: Asset.fromUnits(0, $activeBlockchain!.coreTokenSymbol),
            }),
        }
    }

    async function rex() {
        const actions: AnyAction[] = [
            {
                authorization: [$activeSession!.auth],
                account: 'eosio',
                name: 'deposit',
                data: REXDeposit.from({
                    owner: $activeSession!.auth.actor,
                    amount: cost,
                }),
            },
        ]
        if (resource === 'cpu') {
            actions.push(cpu())
        }
        if (resource === 'net') {
            actions.push(net())
        }
        try {
            await $activeSession!.transact({
                actions,
            })
        } catch (e) {
            error = String(e)
        }
    }
</script>

<style>
</style>

<h2 class="header">Rent {resource.toUpperCase()} from REX...</h2>
<Segment color="white">
    {#if $activeBlockchain?.chainFeatures.has(ChainFeatures.REX)}
        <Form on:submit={rex}>
            <p>Amount of {unit} to rent.</p>
            <Input focus fluid name="amount" bind:value={$amount} />
            <ErrorMessage errorMessage={error} />
            <Button fluid size="large" formValidation on:action={rex}
                >Rent {Number($amount)} {unit} for {$cost}</Button
            >
            <p>Account Balance: {$balance}</p>
        </Form>
    {:else}
        <p>This feature is unavailable on this blockchain.</p>
    {/if}
</Segment>
