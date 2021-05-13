<script lang="ts">
    import {activeBlockchain, activeSession} from '~/store'

    import Button from '~/components/elements/button.svelte'
    import Icon from '~/components/elements/icon.svelte'
    import Text from '~/components/elements/text.svelte'
    import Form from '~/components/elements/form.svelte'

    import {transferData} from '~/pages/transfer/transfer'
    import {txFee} from '~/pages/transfer/fio'
    import StatusAddress from '~/pages/transfer/status/address.svelte'
    import StatusAccount from '~/pages/transfer/status/account.svelte'
    import StatusQuantity from '~/pages/transfer/status/quantity.svelte'
    import StatusMemo from '~/pages/transfer/status/memo.svelte'
    import StatusFee from '~/pages/transfer/status/fee.svelte'
    import {derived, get} from 'svelte/store'
    import type {Readable} from 'svelte/store'
    import type {Balance} from '~/stores/balances'
    import {FIOTransfer, Transfer} from '~/abi-types'
    import {Name} from 'anchor-link'
    import type {Token} from '~/stores/tokens'
    import type {FormTransaction} from '~/ui-types'
    import {getContext} from 'svelte'

    const context: FormTransaction = getContext('transaction')

    export let balance: Readable<Balance | undefined>
    export let token: Readable<Token | undefined>
    export let resetData: () => void

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            handleTransfer()
        }
    }

    const tokenContract: Readable<Name> = derived([token], ([$token]) => {
        if ($token) {
            return Name.from($token.contract)
        }
        return Name.from($activeBlockchain!.coreTokenContract)
    })

    function getActionData() {
        switch (String($tokenContract)) {
            case 'fio.token': {
                return FIOTransfer.from({
                    payee_public_key: $transferData.toAddress!.toLegacyString(
                        $activeBlockchain!.coreTokenSymbol.name
                    ),
                    amount: $transferData.quantity && $transferData.quantity!.units,
                    max_fee: $txFee!.units,
                    actor: $activeSession!.auth.actor,
                    tpid: 'tpid@greymass',
                })
            }
            default: {
                return Transfer.from({
                    from: $activeSession!.auth.actor,
                    to: $transferData.toAccount,
                    quantity: $transferData.quantity,
                    memo: $transferData.memo || '',
                })
            }
        }
    }

    // Create a derived store of the field we expect to be modified
    export const field = derived([balance], ([$balance]) => {
        if ($balance) {
            return $balance.quantity
        }
        return undefined
    })

    async function handleTransfer() {
        // Perform the transfer
        const result = await $activeSession!.transact({
            action: {
                authorization: [$activeSession!.auth],
                account: get(tokenContract),
                name: $activeBlockchain!.coreTokenTransfer,
                data: getActionData(),
            },
        })
        // Reset the form data
        resetData()
        // If the context exists and this is part of a FormTransaction
        if (context) {
            // Pass the transaction ID to the parent
            const txid = String(result.transaction.id)
            context.setTransaction(txid)
            // Await an update on the field expected for this transaction
            context.awaitAccountUpdate(field)
        }
    }
</script>

<style type="scss">
    .button-container {
        display: flex;
        flex-direction: column;
        margin: 20px 0 0;
    }
</style>

<svelte:window on:keydown={handleKeydown} />
<Form>
    {#if $transferData.toAddress}
        <StatusAddress toAddress={$transferData.toAddress} />
    {/if}
    {#if $transferData.toAccount}
        <StatusAccount toAccount={$transferData.toAccount} />
    {/if}
    {#if $transferData.quantity}
        <StatusQuantity quantity={$transferData.quantity} />
    {/if}
    {#if $transferData.quantity && $txFee}
        <StatusFee txFee={$txFee} quantity={$transferData.quantity} />
    {/if}
    {#if $activeBlockchain && $activeBlockchain.id !== 'fio'}
        <StatusMemo memo={$transferData.memo} />
    {/if}
    <div class="button-container">
        <Button primary size="large" formValidation on:action={handleTransfer}>
            <Icon name="edit-3" />
            <Text>Sign Transaction</Text>
        </Button>
    </div>
</Form>
