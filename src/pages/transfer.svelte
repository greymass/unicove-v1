<script lang="ts">
    import { Asset, Name } from 'anchor-link';
    import { isRelease } from '../config';

    import {activeBlockchain, activeSession, currentAccount} from '../store'
    import {FIOTransfer, Transfer} from '../abi-types'

    import TransferBalance from './transfer/balance.svelte'
    import TransferSummary from './transfer/summary.svelte'
    import TransferForm from './transfer/form.svelte'

    import Page from '~/components/layout/page.svelte'

    import { transfer } from '../services/eosio/methods'

    $: balance =
        $currentAccount?.core_liquid_balance ||
        Asset.fromUnits(0, $activeBlockchain.coreTokenSymbol;

    async function loadBalance() {
        ;[balance] = await $activeSession!.client.v1.chain.get_currency_balance(
            $activeBlockchain.coreTokenContract,
            $activeSession!.auth.actor
        )
    }

    $: if ($activeBlockchain.id === 'fio') {
        loadFee()
        loadBalance()
    } else {
        txfee = Asset.fromUnits(0, $activeBlockchain.coreTokenSymbol)
    }

    // TODO: find or build some form builder and validation instead
    //       sextant admin ui has the beginnings of one that can handle core types we could build on
    $: {
        let toName = Name.from(toAccount)
        toAccount = String(toName)
    }
    $: {
        let parsed = parseFloat(value)
        if (isNaN(parsed) || parsed === 0) {
            quantity = Asset.fromUnits(0, $activeBlockchain.coreTokenSymbol)
        } else {
            quantity = Asset.fromFloat(parsed, $activeBlockchain.coreTokenSymbol)
        }
    }
</script>

<style>
    table {
        border: 1;
    }
    table td {
        text-align: right;
    }
</style>

<Page title="Transfer">
    <TransferBalance

    />

    <TransferForm
        bind:toAddress={toAddress}
        bind:toAccount={toAccount}
        bind:memo={memo}
    />

    {#if txfee.value > 0}
        <TransferSummary
            quantity={quantity}
            txFee={txFee}
            activeBlockchain={activeBlockchain}
        />
    {/if}
</Page>
