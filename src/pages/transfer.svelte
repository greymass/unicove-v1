<script lang="ts">
    import type {LinkSession} from 'anchor-link'

    import {Asset, Name} from 'anchor-link'

    import {activeBlockchain, activeSession, currentAccount} from '../store'

    import TransferBalance from './transfer/balance.svelte'
    import TransferSummary from './transfer/summary.svelte'
    import TransferRecipient from './transfer/recipient.svelte'
    import TransferAmount from './transfer/amount.svelte'
    import TransferConfirm from './transfer/confirm.svelte'

    import Page from '~/components/layout/page.svelte'

    import {loadFee, loadBalance} from '../services/eosio/transfer/fio'

    let memo: string = ''
    let quantity: Asset | undefined = undefined
    let toAccount: string = ''
    let toAddress: string = ''
    let txFee: Asset = Asset.fromUnits(0, $activeBlockchain.coreTokenSymbol)
    let amount: string = ''
    let balance: Asset = Asset.fromUnits(0, $activeBlockchain.coreTokenSymbol)
    let balanceValue: number = 0

    let activeSessionObject: LinkSession = $activeSession!

    let step: string = 'recipient'

    $: if ($activeBlockchain.id === 'fio') {
        loadFee($activeBlockchain, activeSessionObject).then((fee) => {
            txFee = fee
        })
        loadBalance($activeBlockchain, activeSessionObject).then((assets) => {
            balance = assets[0]
        })
    } else {
        txFee = Asset.fromUnits(0, $activeBlockchain.coreTokenSymbol)
        balance =
            $currentAccount?.core_liquid_balance ||
            Asset.fromUnits(0, $activeBlockchain.coreTokenSymbol)
    }

    $: {
        let toName = Name.from(toAccount)
        toAccount = String(toName)
    }

    $: {
        let parsed = parseFloat(amount)
        if (isNaN(parsed) || parsed === 0) {
            quantity = Asset.fromUnits(0, $activeBlockchain.coreTokenSymbol)
        } else {
            quantity = Asset.fromFloat(parsed, $activeBlockchain.coreTokenSymbol)
        }
    }
    $: {
        balanceValue = (balance && balance.units.toNumber())!
    }
</script>

<style>
    .container {
        max-width: 400px;
    }
</style>

<Page title="Create Transfer">
    <div class="container">
        <TransferBalance {balance} />

        {#if quantity && txFee.value > 0}
            <TransferSummary activeBlockchain={$activeBlockchain} {quantity} {txFee} />
        {/if}

        <br />

        {#if step === 'recipient'}
            <TransferRecipient
                activeBlockchain={$activeBlockchain}
                activeSession={activeSessionObject}
                bind:step
                bind:toAddress
                bind:toAccount
            />
        {/if}

        {#if step === 'amount'}
            <TransferAmount availableBalance={balanceValue} bind:amount bind:step />
        {/if}

        {#if step === 'confirm'}
            <TransferConfirm
                activeBlockchain={$activeBlockchain}
                activeSession={activeSessionObject}
                availableBalance={balanceValue}
                {quantity}
                {txFee}
                bind:amount
                bind:memo
                bind:step
                bind:toAccount
                bind:toAddress
            />
        {/if}
    </div>
</Page>
