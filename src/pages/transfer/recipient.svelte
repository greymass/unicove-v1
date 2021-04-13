<script lang="ts">
    import type {Writable} from 'svelte/store'

    import {Asset, PublicKey, Name} from '@greymass/eosio'
    import {writable} from 'svelte/store'

    import {transferData} from './transferData'

    import {activeBlockchain, activeSession} from '~/store'

    import {Step} from './types'

    import Button from '~/components/elements/button.svelte'
    import InputAccountLookup from '~/components/elements/input/account/lookup.svelte'
    import InputAddress from '~/components/elements/input/address.svelte'
    import Form from '~/components/elements/form.svelte'

    export let balance: Asset

    let loading: Writable<boolean> = writable<boolean>(false)
    let toAddress: string = String($transferData.toAddress || '')
    let toAccount: string = String($transferData.toAccount || '')

    function confirmChange() {
        transferData.update((data) => ({
            ...data,
            toAccount: toAccount && toAccount.length > 0 ? Name.from(toAccount) : undefined,
            toAddress: toAddress && toAddress.length > 0 ? PublicKey.from(toAddress) : undefined,
            step: Step.Amount,
        }))
    }
</script>

<style type="scss">
    .container {
        display: flex;
        flex-direction: column;
        border-top: 1px solid var(--divider-grey);
    }
</style>

<div class="container">
    <div class="field-container">
        <Form on:submit={confirmChange}>
            {#if $activeBlockchain && $activeBlockchain.id === 'fio'}
                <InputAddress
                    bind:value={toAddress}
                    focus
                    fluid
                    name="to"
                    placeholder="recipient public key..."
                />
                <Button size="large" fluid formValidation on:action={confirmChange}>
                    Send {balance.symbol.name}
                    {#if toAddress}
                        to {toAddress}
                    {/if}
                </Button>
            {:else}
                <InputAccountLookup
                    bind:loading
                    bind:value={toAccount}
                    focus
                    fluid
                    name="to"
                    placeholder="recipient account name..."
                    activeSession={$activeSession}
                />
                <Button
                    primary
                    {loading}
                    size="large"
                    fluid
                    formValidation
                    on:action={confirmChange}
                >
                    Send {balance.symbol.name}
                    {#if toAccount}
                        to {toAccount}
                    {/if}
                </Button>
            {/if}
        </Form>
    </div>
</div>
