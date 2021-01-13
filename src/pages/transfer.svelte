<script lang="ts">
    import {Asset, Name, UInt64} from 'anchor-link'

    import {activeSession, currentAccount} from '../store'
    import {Transfer} from '../abi-types'

    import Page from '../components/page.svelte'

    $: coreSymbol = $currentAccount?.core_liquid_balance?.symbol || Asset.Symbol.from('4,EOS') // TODO: get core symbol from chain config
    $: balance = $currentAccount?.core_liquid_balance || Asset.fromUnits(0, coreSymbol)
    let to = 'teamgreymass'
    let quantity = '0'
    let memo = '🦄🧠🥌'

    // TODO: find or build some form builder and validation instead
    //       sextant admin ui has the beginnings of one that can handle core types we could build on
    $: {
        let toName = Name.from(to)
        to = String(toName)
    }
    $: {
        let value = parseFloat(quantity)
        if (isNaN(value) || value === 0) {
            quantity = String(Asset.fromUnits(1, coreSymbol))
        } else {
            quantity = String(Asset.fromFloat(value, coreSymbol))
        }
    }

    async function transfer() {
        // TODO: status display && error handling
        await $activeSession!.transact({
            action: {
                authorization: [$activeSession!.auth],
                account: 'eosio.token',
                name: 'transfer',
                data: Transfer.from({
                    from: $activeSession!.auth.actor,
                    to,
                    quantity,
                    memo,
                }),
            },
        })
        // adjust balance to reflect transfer
        balance.units = UInt64.from(
            balance.units.toNumber() - Asset.from(quantity).units.toNumber()
        )
    }
</script>

<Page title="Transfer">
    <p>You have <i on:click={() => (quantity = String(balance))}> {balance} </i></p>
    <p>
        Send
        <input type="text" bind:value={quantity} />
        to
        <input type="text" bind:value={to} />
        with memo
        <input type="text" bind:value={memo} />
        <button on:click={transfer}>go</button>
    </p>
</Page>
