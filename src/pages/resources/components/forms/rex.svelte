<script lang="ts">
    import type {AnyAction} from '@greymass/eosio'
    import {Asset} from '@greymass/eosio'
    import {getContext} from 'svelte'
    import type {Readable, Writable} from 'svelte/store'
    import {derived, writable} from 'svelte/store'

    import {REXDeposit, REXRentCPU, REXRentNET} from '~/abi-types'
    import {ChainFeatures} from '~/config'
    import {activeBlockchain, activeSession, currentAccount} from '~/store'
    import {systemToken} from '~/stores/tokens'
    import {systemTokenBalance} from '~/stores/balances'
    import {rexPrice} from '~/pages/resources/resources'

    import type {FormTransaction} from '~/ui-types'
    import Button from '~/components/elements/button.svelte'
    import Form from '~/components/elements/form.svelte'
    import FormBalance from '~/components/elements/form/balance.svelte'
    import Input from '~/components/elements/input.svelte'
    import InputErrorMessage from '~/components/elements/input/errorMessage.svelte'
    import Segment from '~/components/elements/segment.svelte'

    const context: FormTransaction = getContext('transaction')

    export let resource = 'cpu'
    const unit = resource === 'cpu' ? 'ms' : 'kb'

    let amount: Writable<string> = writable('')
    let error: string | undefined

    const {REX} = ChainFeatures

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

    function cpu() {
        return {
            authorization: [$activeSession!.auth],
            account: 'eosio',
            name: 'rentcpu',
            data: REXRentCPU.from({
                from: $activeSession!.auth.actor,
                receiver: $activeSession!.auth.actor,
                loan_payment: $cost,
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
                loan_payment: $cost,
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
                    amount: $cost,
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
            const result = await $activeSession!.transact({
                actions,
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
    {#if $activeBlockchain?.chainFeatures.has(REX)}
        <Form on:submit={rex}>
            <p>Amount of {unit} to rent from REX.</p>
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
            <Button fluid size="large" formValidation on:action={rex}
                >Rent {Number($amount)} {unit} for {$cost}</Button
            >
        </Form>
    {:else}
        <p>This feature is unavailable on this blockchain.</p>
    {/if}
</Segment>
