<script lang="ts">
    import {Name} from 'anchor-link'
    import {getContext} from 'svelte'
    import type {Readable} from 'svelte/store'
    import {derived, get} from 'svelte/store'

    import {FIOTransfer, Transfer} from '~/abi-types'
    import {activeBlockchain, activeSession} from '~/store'
    import type {Balance} from '~/stores/balances'
    import type {Token} from '~/stores/tokens'
    import {txFee} from './fio'
    import {transferData, Step} from '~/pages/transfer/transfer'

    import Button from '~/components/elements/button.svelte'
    import Icon from '~/components/elements/icon.svelte'

    import type {FormTransaction} from '~/ui-types'
    import TransferRecipient from '~/pages/transfer/step/recipient.svelte'
    import TransferAmount from '~/pages/transfer/step/amount.svelte'
    import TransferConfirm from '~/pages/transfer/step/confirm.svelte'
    import TransferReceive from '~/pages/transfer/step/receive.svelte'
    import TransferSending from '~/pages/transfer/step/sending.svelte'

    export let balance: Readable<Balance | undefined>
    export let token: Readable<Token | undefined>
    export let resetData: () => void

    const context: FormTransaction = getContext('transaction')

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
        transferData.update((data) => ({
            ...data,
            step: Step.Sending,
            backStep: undefined,
        }))
        try {
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
        } catch (error) {
            console.warn('Error during transact', error)

            if (context) {
                context.setTransactionError(error)
            }
        }
    }
</script>

<style type="scss">
    .container {
        margin: 0 auto;
        max-width: 28rem;
    }
    .controls {
        text-align: center;
        :global(.button) {
            background: none;
            color: var(--main-blue);
            text-transform: uppercase;
        }
    }
    .header {
        color: var(--main-black);
        font-family: Inter;
        font-style: normal;
        font-weight: bold;
        font-size: 24px;
        line-height: 29px;
        text-align: center;
        letter-spacing: -0.47px;
        margin-bottom: 7px;
    }
    .subheader {
        color: var(--light-grey);
        font-family: Inter;
        font-style: normal;
        font-weight: normal;
        font-size: 16px;
        line-height: 19px;
        text-align: center;
        letter-spacing: -0.18px;
    }
    .progress {
        margin: 18px 0 42px;
        text-align: center;
        .step {
            display: inline-block;
            height: 4px;
            width: 105px;
            margin: 0 3px 0 0;
            background: var(--light-blue);
        }
        &.step-1 .step:nth-child(-n + 1),
        &.step-2 .step:nth-child(-n + 2),
        &.step-3 .step:nth-child(-n + 3) {
            background: var(--main-blue);
        }
    }
    @media only screen and (max-width: 600px) {
        .progress {
            margin: 12px 0 24px;
            .step {
                width: 85px;
            }
        }
    }
</style>

<div class="container">
    {#if ![Step.Sending].includes($transferData.step)}
        <div class="header">
            {$transferData.step === Step.Receive ? 'Receive tokens' : 'Send tokens'}
        </div>
        {#if $transferData.step === Step.Receive}
            <div class="subheader">Use your account name</div>
        {/if}
    {/if}
    {#if [Step.Recipient, Step.Amount, Step.Confirm].includes($transferData.step)}
        {#if $transferData.step === Step.Recipient}
            <div class="subheader">Add recipient</div>
        {/if}
        {#if $transferData.step === Step.Amount}
            <div class="subheader">Select an amount</div>
        {/if}
        {#if $transferData.step === Step.Token}
            <div class="subheader">Select the token</div>
        {/if}
        {#if $transferData.step === Step.Confirm && $transferData.quantity}
            <div class="subheader">Review and sign</div>
        {/if}
        <div class={`progress step-${Number($transferData.step)}`}>
            <div class="step" />
            <div class="step" />
            <div class="step" />
        </div>
    {/if}
    {#if [Step.Sending].includes($transferData.step)}
        <div class="header">
            <Icon size="huge" name="radio" />
            <div>Sending Tokens</div>
        </div>
        <div class="subheader">Requesting signature from wallet</div>
    {/if}
    {#if $balance && $token}
        {#if $transferData.step === Step.Recipient}
            <TransferRecipient {balance} token={$token} />
        {/if}
        {#if $transferData.step === Step.Amount}
            <TransferAmount {balance} token={$token} />
        {/if}
        {#if $transferData.step === Step.Confirm && $transferData.quantity}
            <TransferConfirm {handleTransfer} />
        {/if}
        {#if $transferData.step === Step.Receive}
            <TransferReceive />
        {/if}
        {#if $transferData.step === Step.Sending}
            <TransferSending />
        {/if}
    {:else}
        No balance of this token to transfer!
    {/if}
    {#if ![Step.Receive, Step.Sending].includes($transferData.step)}
        <div class="controls">
            {#if $transferData.step > 1}
                <Button on:action={resetData}>Restart</Button>
            {:else}
                <Button href="/">Cancel</Button>
            {/if}
        </div>
    {/if}
</div>
