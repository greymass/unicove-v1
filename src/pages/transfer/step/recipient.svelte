<script lang="ts">
    import {PublicKey, Name} from '@greymass/eosio'
    import type {Readable} from 'svelte/store'

    import {activeBlockchain, activeSession} from '~/store'
    import type {Balance} from '~/stores/balances'
    import type {Token} from '~/stores/tokens'

    import Button from '~/components/elements/button.svelte'
    import InputAccountLookup from '~/components/elements/input/account/lookup.svelte'
    import InputPublicKey from '~/components/elements/input/publicKey.svelte'
    import Form from '~/components/elements/form.svelte'

    import {transferData, Step} from '~/pages/transfer/transfer'
    import Text from '~/components/elements/text.svelte'
    import Icon from '~/components/elements/icon.svelte'

    export let balance: Readable<Balance | undefined>
    export let token: Token

    let loading = false
    let toAddress: string = String($transferData.toAddress || '')
    let toAccount: string = String($transferData.toAccount || '')

    function confirmChange() {
        transferData.update((data) => ({
            ...data,
            toAccount: toAccount && toAccount.length > 0 ? Name.from(toAccount) : undefined,
            toAddress: toAddress && toAddress.length > 0 ? PublicKey.from(toAddress) : undefined,
            step: data.backStep || Step.Amount,
            backStep: undefined,
        }))
    }
</script>

<style type="scss">
</style>

<div class="container">
    {#if balance && token}
        <Form on:submit={confirmChange}>
            {#if $activeBlockchain && $activeBlockchain.id === 'fio'}
                <InputPublicKey
                    bind:value={toAddress}
                    focus
                    fluid
                    name="to"
                    placeholder="Enter public key"
                />
            {:else}
                <InputAccountLookup
                    bind:loading
                    bind:value={toAccount}
                    focus
                    fluid
                    name="to"
                    placeholder="Enter account name"
                    activeSession={$activeSession}
                />
            {/if}
            <Button
                primary
                disabled={loading}
                size="large"
                fluid
                formValidation
                on:action={confirmChange}
            >
                {#if loading}
                    <Icon spin name="life-buoy" />
                {/if}
                {#if $transferData.backStep}
                    <Text>Done</Text>
                {:else}
                    <Text>Next</Text>
                {/if}
            </Button>
        </Form>
    {:else}
        No balance for this token to send!
    {/if}
</div>
