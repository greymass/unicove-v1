<script lang="ts">
    import {Asset} from 'anchor-link'
    import {getContext} from 'svelte'
    import type {Readable, Writable} from 'svelte/store'
    import {derived, writable} from 'svelte/store'

    import {Stake} from '~/abi-types'
    import {ChainFeatures} from '~/config'
    import {activeBlockchain, activeSession, currentAccount} from '~/store'
    import {systemToken} from '~/stores/tokens'
    import {systemTokenBalance} from '~/stores/balances'

    import type {FormTransaction} from '~/ui-types'
    import Button from '~/components/elements/button.svelte'
    import Form from '~/components/elements/form.svelte'
    import FormBalance from '~/components/elements/form/balance.svelte'
    import InputAsset from '~/components/elements/input/asset.svelte'
    import InputErrorMessage from '~/components/elements/input/errorMessage.svelte'
    import Segment from '~/components/elements/segment.svelte'

    const context: FormTransaction = getContext('transaction')

    export let resource = 'cpu'

    let error: string | undefined
    let cpu: Writable<string> = writable('')
    let net: Writable<string> = writable('')

    const {Staking} = ChainFeatures

    const amountCPU: Readable<Asset> = derived(cpu, ($cpu) => {
        let amount = parseFloat($cpu)
        if (isNaN(amount)) {
            amount = 0
        }
        return Asset.fromFloat(amount, $activeBlockchain.coreTokenSymbol)
    })

    const amountNET: Readable<Asset> = derived(net, ($net) => {
        let amount = parseFloat($net)
        if (isNaN(amount)) {
            amount = 0
        }
        return Asset.fromFloat(amount, $activeBlockchain.coreTokenSymbol)
    })

    // Create a derived store of the field we expect to be modified
    export const field = derived([currentAccount], ([$currentAccount]) => {
        if ($currentAccount && $currentAccount.self_delegated_bandwidth) {
            return $currentAccount.self_delegated_bandwidth.cpu_weight
        }
        return undefined
    })

    async function stake() {
        try {
            const result = await $activeSession!.transact({
                actions: [
                    {
                        authorization: [$activeSession!.auth],
                        account: 'eosio',
                        name: 'delegatebw',
                        data: Stake.from({
                            from: $activeSession!.auth.actor,
                            receiver: $activeSession!.auth.actor,
                            stake_net_quantity: $amountNET,
                            stake_cpu_quantity: $amountCPU,
                            transfer: false,
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

<Segment color="white">
    {#if $activeBlockchain?.chainFeatures.has(Staking)}
        <Form on:submit={stake}>
            {#if resource === 'cpu'}
                <p>Amount of {$activeBlockchain.coreTokenSymbol.name} to stake as CPU:</p>
                <InputAsset
                    allowZero
                    focus
                    fluid
                    name="cpu"
                    placeholder={`number of tokens`}
                    bind:value={$cpu}
                />
            {/if}
            {#if resource === 'net'}
                <p>Amount of EOS to stake as NET:</p>
                <InputAsset
                    allowZero
                    focus
                    fluid
                    name="net"
                    placeholder={`number of tokens`}
                    bind:value={$net}
                />
            {/if}
            {#if $systemToken}
                <FormBalance token={$systemToken} balance={systemTokenBalance} />
            {/if}
            <InputErrorMessage errorMessage={error} />
            <Button fluid size="large" formValidation on:action={stake}>Stake Tokens</Button>
        </Form>
        <ul />
    {:else}
        <p>This feature is unavailable on this blockchain.</p>
    {/if}
</Segment>
