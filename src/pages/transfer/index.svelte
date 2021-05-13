<script lang="ts">
    import type {Readable} from 'svelte/store'
    import type {TinroRouteMeta} from 'tinro'
    import {onMount} from 'svelte'
    import {derived} from 'svelte/store'
    import {Asset, Name} from 'anchor-link'

    import {activeBlockchain, activeSession} from '~/store'
    import type {Token, TokenKeyParams} from '~/stores/tokens'
    import type {Balance} from '~/stores/balances'
    import {balances, makeBalanceKey} from '~/stores/balances'
    import {tokens, makeTokenKey} from '~/stores/tokens'
    import {systemTokenKey} from '~/stores/tokens'
    import {transferData, Step} from '~/pages/transfer/transfer'
    import {syncTxFee, stopSyncTxFee, fetchTxFee} from '~/pages/transfer/fio'

    import Button from '~/components/elements/button.svelte'
    import TransactionForm from '~/components/elements/form/transaction.svelte'
    import Page from '~/components/layout/page.svelte'

    import TransferRecipient from '~/pages/transfer/step/recipient.svelte'
    import TransferAmount from '~/pages/transfer/step/amount.svelte'
    import TransferConfirm from '~/pages/transfer/step/confirm.svelte'
    import TransferMemo from '~/pages/transfer/step/memo.svelte'
    import TransferToken from '~/pages/transfer/step/token.svelte'

    export let meta: TinroRouteMeta | undefined = undefined

    onMount(() => {
        syncTxFee()
        return () => {
            stopSyncTxFee()
        }
    })

    const token: Readable<Token | undefined> = derived(
        [activeSession, systemTokenKey, transferData, tokens],
        ([$activeSession, $systemTokenKey, $transferData, $tokens]) => {
            if ($activeSession && $systemTokenKey && $tokens) {
                // If this transfer session data has a token key, use it first
                if ($transferData.tokenKey) {
                    return $tokens.find((t) => t.key === $transferData.tokenKey)
                }
                // If the URL has a token key, use it second
                if (meta) {
                    const params: TokenKeyParams = {
                        chainId: $activeBlockchain!.chainId,
                        contract: Name.from(meta.params.contract),
                        name: Name.from(meta.params.token),
                    }
                    const key = makeTokenKey(params)
                    return $tokens.find((t) => t.key === key)
                }
                // Otherwise return the system token key
                return $tokens.find((t) => t.key === $systemTokenKey)
            }
        }
    )

    const balance: Readable<Balance | undefined> = derived(
        [activeSession, balances, token],
        ([$activeSession, $currentBalances, $token]) => {
            if ($token) {
                const key = makeBalanceKey($token, $activeSession!.auth.actor)
                return $currentBalances.find((b) => b.key === key)
            }
        }
    )

    const quantity: Readable<Asset | undefined> = derived([transferData], ([$transferData]) => {
        if ($transferData && $transferData.quantity) {
            return $transferData.quantity
        }
    })

    function resetData() {
        transferData.set({
            step: Step.Recipient,
        })
        fetchTxFee()
    }
</script>

<style type="scss">
    :global(form) {
        margin: 1em 0;
    }
    :global(form input) {
        margin: 2em 0;
    }
</style>

<Page title="Send tokens">
    <TransactionForm>
        <div class="container">
            {#if $balance && $token}
                {#if $transferData.step === Step.Token}
                    <TransferToken />
                {/if}
                {#if $transferData.step === Step.Recipient}
                    <TransferRecipient {balance} token={$token} />
                {/if}
                {#if $transferData.step === Step.Amount}
                    <TransferAmount {balance} token={$token} />
                {/if}
                {#if $transferData.step === Step.Confirm && $quantity}
                    <TransferConfirm {balance} {token} {resetData} />
                {/if}
                {#if $transferData.step === Step.Memo}
                    <TransferMemo />
                {/if}
            {:else}
                No balance of this token to transfer!
            {/if}
            {#if $transferData.step > 0}
                <Button fluid on:action={resetData}>Cancel</Button>
            {/if}
        </div>
    </TransactionForm>
</Page>
