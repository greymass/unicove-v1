<script lang="ts">
    import type {LinkSession} from 'anchor-link'

    import {Asset, Name} from 'anchor-link'

    import {activeBlockchain, activeSession, currentAccount} from '../store'

    import TransferBalance from './transfer/balance.svelte'
    import TransferSummary from './transfer/summary.svelte'
    import TransferForm from './transfer/form.svelte'

    import Page from '~/components/layout/page.svelte'

    import {loadFee, loadBalance} from '../services/eosio/transfer/fio'

    let memo: string = ''
    let quantity: Asset | undefined = undefined
    let toAccount: string = ''
    let toAddress: string  = ''
    let txFee: Asset = Asset.fromUnits(0, $activeBlockchain.coreTokenSymbol)
    let amount: string = ''
    let balance: Asset | undefined = undefined
    let balanceValue: number = 0

    let activeSessionObject: LinkSession = $activeSession!;

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

    // TODO: find or build some form builder and validation instead
    //       sextant admin ui has the beginnings of one that can handle core types we could build on
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
        <TransferBalance {balanceValue} />

        <br />

        <TransferForm
            activeBlockchain={$activeBlockchain}
            activeSession={activeSessionObject}
            availableBalance={balanceValue}
            {quantity}
            {txFee}
            bind:amount
            bind:memo
            bind:toAccount
            bind:toAddress
        />

        {#if quantity && txFee.value > 0}
            <TransferSummary activeBlockchain={$activeBlockchain} {quantity} {txFee} />
        {/if}
    </div>
</Page>
