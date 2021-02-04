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

    let memo = '';
    let quantity = '';
    let toAccount = '';
    let toAddress = '';
    let txfee = Asset.fromUnits(0, $activeBlockchain.coreTokenSymbol);
    let value = '';

    $: balance =
        $currentAccount?.core_liquid_balance ||
        Asset.fromUnits(0, $activeBlockchain.coreTokenSymbol);

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
        console.log({toAccount})
        let toName = Name.from(toAccount)
        console.log({toName})
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
    .container{
      max-width: 400px;
    }

    hr {
      margin: 30px 0;
    }
</style>

<Page title="Transfer">
    <div class="container">
        <TransferBalance
            balance={balance}
            activeBlockchain={$activeBlockchain}
        />

        <hr/>

        <TransferForm
            activeBlockchain={activeBlockchain}
            transfer={transfer}
            bind:toAddress={toAddress}
            bind:toAccount={toAccount}
            bind:memo={memo}
        />

        {#if txfee.value > 0}
            <TransferSummary
                activeBlockchain={activeBlockchain}
                quantity={quantity}
                txFee={txFee}
            />
        {/if}
    </div>
</Page>
