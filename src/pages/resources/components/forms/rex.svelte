<script lang="ts">
    import type {AnyAction} from 'anchor-link'
    import {Asset} from '@greymass/eosio'

    import {activeBlockchain, activeSession, currentAccount} from '~/store'
    import {ChainFeatures} from '~/config'

    import {rexPrice, sampleUsage, stateREX} from '~/pages/resources/resources'

    import Button from '~/components/elements/button.svelte'
    import Form from '~/components/elements/form.svelte'
    import Input from '~/components/elements/input.svelte'
    import Segment from '~/components/elements/segment.svelte'

    import {REXDeposit, REXRentCPU, REXRentNET} from '~/abi-types'

    export let resource = 'cpu'

    $: loading = $currentAccount

    let amount: string = '1'
    let cost = Asset.from(Number($rexPrice) * Number(amount), $activeBlockchain.coreTokenSymbol)
    let error: string | undefined

    $: balance =
        $currentAccount?.core_liquid_balance ||
        Asset.fromUnits(0, $activeBlockchain.coreTokenSymbol)

    $: {
        cost = Asset.from(
            Number($rexPrice.value) * Number(amount),
            $activeBlockchain.coreTokenSymbol
        )
    }

    function cpu() {
        return {
            authorization: [$activeSession!.auth],
            account: 'eosio',
            name: 'rentcpu',
            data: REXRentCPU.from({
                from: $activeSession!.auth.actor,
                receiver: $activeSession!.auth.actor,
                loan_payment: cost,
                loan_fund: Asset.fromUnits(0, $activeBlockchain.coreTokenSymbol),
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
                loan_fund: Asset.fromUnits(0, $activeBlockchain.coreTokenSymbol),
            }),
        }
    }

    async function powerup() {
        if (!$stateREX) {
            throw new Error('PowerUp state not loaded.')
        }
        if (!$sampleUsage) {
            throw new Error('Usage sample required.')
        }
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

<Segment color="white">
    {#await loading}
        <p>Hang on, fetching balances and stuff...</p>
    {:then _}
        {#if $activeBlockchain.chainFeatures.has(ChainFeatures.REX)}
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
