<script lang="ts">
    import {Asset, LinkSession, Name, UInt64} from 'anchor-link'

    import {Transfer} from '../abi-types'
    import {activeBlockchain, activeSession} from '../store'

    import Page from '../components/page.svelte'

    let balance = Asset.fromUnits(0, $activeBlockchain.coreTokenSymbol)
    let toAccount = 'teamgreymass'
    let value = '0'
    let quantity = Asset.fromUnits(parseFloat(value), $activeBlockchain.coreTokenSymbol)
    let memo = '🦄🧠🥌'

    // TODO: we need some sort of global account store/cache instead of pulling it every page load
    async function loadAccount(session: LinkSession) {
        balance = Asset.fromUnits(0, $activeBlockchain.coreTokenSymbol)
        const account = await session.client.v1.chain.get_account(session.auth.actor)
        if (account.core_liquid_balance) {
            balance = account.core_liquid_balance
        }
        return account
    }

    // load account based on active session
    $: loading = loadAccount($activeSession!)

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
    {#await loading}
        <p>Hang on, fetching balances and stuff...</p>
    {:then _}
        <p>You have <i on:click={() => {
            value = String(balance.value)
            quantity = Asset.fromUnits(value, $activeBlockchain.coreTokenSymbol)
        }}> {balance} </i></p>
        <p>
            Send
            <input type="text" bind:value={quantity} />
            to
            <input type="text" bind:value={to} />
            with memo
            <input type="text" bind:value={memo} />
            <button on:click={transfer}>go</button>
        </p>
    {/await}
</Page>
