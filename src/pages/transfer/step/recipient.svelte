<script lang="ts">
    import {PublicKey, Name} from '@greymass/eosio'
    import type {Writable} from 'svelte/store'
    import {writable} from 'svelte/store'

    import {activeBlockchain, activeSession} from '~/store'
    import type {Balance} from '~/stores/balances'
    import type {Token} from '~/stores/tokens'

    import Button from '~/components/elements/button.svelte'
    import InputAccountLookup from '~/components/elements/input/account/lookup.svelte'
    import InputPublicKey from '~/components/elements/input/publicKey.svelte'
    import Form from '~/components/elements/form.svelte'

    import {transferData, Step} from '~/pages/transfer/transfer'
    import StatusToken from '~/pages/transfer/status/token.svelte'

    export let balance: Balance
    export let token: Token

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
</style>

<div class="container">
    {#if balance && token}
        <StatusToken {token} />
        <Form on:submit={confirmChange}>
            {#if $activeBlockchain && $activeBlockchain.id === 'fio'}
                <InputPublicKey
                    bind:value={toAddress}
                    focus
                    fluid
                    name="to"
                    placeholder="Recipient public key..."
                />
                <Button size="large" fluid formValidation on:action={confirmChange}>
                    Send {token.name}
                </Button>
            {:else}
                <InputAccountLookup
                    bind:loading
                    bind:value={toAccount}
                    focus
                    fluid
                    name="to"
                    placeholder="Recipient account name..."
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
                    Send {token.name}
                    {#if toAccount}
                        to {toAccount}
                    {/if}
                </Button>
            {/if}
        </Form>
    {:else}
        No balance for this token to send!
    {/if}
</div>
