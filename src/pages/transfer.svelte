<script lang="ts">
    import {Asset, Name} from 'anchor-link'
    import {isRelease} from '../config'

    import {activeBlockchain, activeSession, currentAccount} from '../store'
    import {FIOTransfer, Transfer} from '../abi-types'

    import TransferBalance from './transfer/balance.svelte'
    import TransferSummary from './transfer/summary.svelte'
    import TransferForm from './transfer/form.svelte'

    import Page from '~/components/layout/page.svelte'

    import {transfer} from '../services/eosio/methods'
    import {loadFee, loadBalance} from '../services/eosio/transfer/fio'

    let memo = ''
    let quantity = ''
    let toAccount = ''
    let toAddress = ''
    let txFee = Asset.fromUnits(0, $activeBlockchain.coreTokenSymbol)
    let amount = ''
    let balance

    $: if ($activeBlockchain.id === 'fio') {
        loadFee($activeBlockchain, $activeSession).then((fee) => {
            txFee = fee
        })
        balance = loadBalance($activeBlockchain, $activeSession).then((amount) => {
            balance = amount
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
</script>

<style>
    .container {
        max-width: 400px;
    }

    hr {
        margin: 30px 0 10px 0;
        height: 1px;
        border-bottom: none;
    }
</style>

<Page title="Create Transfer">
    <div class="container">
        <TransferBalance {balance} activeBlockchain={$activeBlockchain} />

        <hr />

        <TransferForm
            activeBlockchain={$activeBlockchain}
            activeSession={$activeSession}
            availableBalance={balance}
            {quantity}
            {transfer}
            {txFee}
            bind:amount
            bind:memo
            bind:toAccount
            bind:toAddress
        />

        {#if txFee.value > 0}
            <TransferSummary activeBlockchain={$activeBlockchain} {quantity} {txFee} />
        {/if}
    </div>
</Page>
