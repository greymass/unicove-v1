<script lang="ts">
    import type {Readable} from 'svelte/store'
    import type {TinroRouteMeta} from 'tinro'
    import {onMount} from 'svelte'
    import {get, derived, writable} from 'svelte/store'
    import {Asset, Name} from 'anchor-link'

    import {FIOTransfer, Transfer} from '~/abi-types'
    import {activeBlockchain, activeSession} from '~/store'
    import type {Token, TokenKeyParams} from '~/stores/tokens'
    import {makeTokenKey} from '~/stores/tokens'
    import type {Balance} from '~/stores/balances'
    import {getBalance, makeBalanceKey} from '~/stores/balances'
    import {tokens} from '~/stores/tokens'

    import Button from '~/components/elements/button.svelte'
    import Modal from '~/components/elements/modal.svelte'
    import Page from '~/components/layout/page.svelte'
    import TransactionNotificationSuccess from '~/components/elements/notification/transaction/success.svelte'

    import {transferData, Step} from '~/pages/transfer/transfer'
    import {txFee, syncTxFee, stopSyncTxFee, fetchTxFee} from '~/pages/transfer/fio'
    import TransferRecipient from '~/pages/transfer/step/recipient.svelte'
    import TransferAmount from '~/pages/transfer/step/amount.svelte'
    import TransferConfirm from '~/pages/transfer/step/confirm.svelte'
    import TransferMemo from '~/pages/transfer/step/memo.svelte'

    export let meta: TinroRouteMeta | undefined = undefined

    let successTx: string | undefined = undefined
    let displaySuccessTx = writable<boolean>(false)

    onMount(() => {
        syncTxFee()
        return () => {
            // on unmount
            stopSyncTxFee()
        }
    })

    const token: Readable<Token | undefined> = derived(
        [activeSession, tokens],
        ([$activeSession, $tokens]) => {
            if (meta && $activeSession && $tokens) {
                const params: TokenKeyParams = {
                    chainId: $activeBlockchain.chainId,
                    contract: Name.from(meta.params.contract),
                    name: Name.from(meta.params.token),
                }
                const key = makeTokenKey(params)
                return $tokens.find((t) => t.key === key)
            }
        }
    )

    const tokenContract: Readable<Name> = derived([token], ([$token]) => {
        if ($token) {
            return Name.from($token.contract)
        }
        return Name.from($activeBlockchain.coreTokenContract)
    })

    const balance: Readable<Balance | undefined> = derived(
        [activeSession, token],
        ([$activeSession, $token]) => {
            if ($activeSession && $token) {
                return getBalance(makeBalanceKey($token, $activeSession.auth.actor))
            }
        }
    )

    const quantity: Readable<Asset | undefined> = derived([transferData], ([$transferData]) => {
        if ($transferData && $transferData.quantity) {
            return $transferData.quantity
        }
    })

    let previousActor: string | undefined = undefined
    $: if ($activeSession && String($activeSession.auth.actor) !== previousActor) {
        resetData()
        previousActor = String($activeSession.auth.actor)
    }

    function resetData() {
        transferData.set({
            step: Step.Recipient,
        })
        fetchTxFee()
    }

    function getActionData() {
        let data: Transfer | FIOTransfer | undefined

        switch (String($tokenContract)) {
            case 'fio.token': {
                data = FIOTransfer.from({
                    payee_public_key: $transferData.toAddress!.toLegacyString(
                        $activeBlockchain.coreTokenSymbol.name
                    ),
                    amount: quantity && $quantity!.units,
                    max_fee: $txFee!.units,
                    actor: $activeSession!.auth.actor,
                    tpid: 'tpid@greymass',
                })
                break
            }
            default: {
                data = Transfer.from({
                    from: $activeSession!.auth.actor,
                    to: $transferData.toAccount,
                    quantity: $transferData.quantity,
                    memo: $transferData.memo || '',
                })
                break
            }
        }
        return data
    }

    async function handleTransfer() {
        $activeSession!
            .transact({
                action: {
                    authorization: [$activeSession!.auth],
                    account: get(tokenContract),
                    name: $activeBlockchain.coreTokenTransfer,
                    data: getActionData(),
                },
            })
            .then((result) => {
                successTx = result?.payload?.tx
                $displaySuccessTx = true
                resetData()
            })
    }
</script>

<style>
</style>

<Page title="Transfer Tokens">
    <div class="container">
        {#if $balance && $token}
            {#if $transferData.step === Step.Recipient}
                <TransferRecipient balance={$balance} token={$token} />
            {/if}
            {#if $transferData.step === Step.Amount}
                <TransferAmount balance={$balance} token={$token} />
            {/if}
            {#if $transferData.step === Step.Confirm && $quantity}
                <TransferConfirm token={$token} {handleTransfer} />
            {/if}
            {#if $transferData.step === Step.Memo}
                <TransferMemo token={$token} />
            {/if}
        {:else}
            No balance of this token to transfer!
        {/if}

        {#if $displaySuccessTx}
            <Modal display={displaySuccessTx}>
                <TransactionNotificationSuccess
                    activeBlockchain={$activeBlockchain}
                    tx={successTx}
                />
            </Modal>
        {/if}

        {#if $transferData.step > 0}
            <Button fluid on:action={resetData}>Reset Transfer</Button>
        {/if}
    </div>
</Page>
