<script lang="ts">
    import {Asset, LinkSession, Name, UInt64} from 'anchor-link'

    import {activeBlockchain, activeSession} from '../store'
    import {FIOTransfer, Transfer} from '../abi-types'

    import Page from '../components/page.svelte'

    let balance = Asset.fromUnits(0, $activeBlockchain.coreTokenSymbol)
    let toAccount = 'teamgreymass'
    let toAddress = 'FIO7hF6waZH6pBvVLrLj5ZLNTcUfcT6nNYiCVtYAmahnmzanqU1aA'
    let value = '0'
    let quantity = Asset.fromUnits(parseFloat(value), $activeBlockchain.coreTokenSymbol)
    let memo = '🦄🧠🥌'
    let txfee = Asset.fromUnits(0, $activeBlockchain.coreTokenSymbol)

    // TODO: we need some sort of global account store/cache instead of pulling it every page load
    async function loadAccount(session: LinkSession) {
        balance = Asset.fromUnits(0, $activeBlockchain.coreTokenSymbol)
        const account = await session.client.v1.chain.get_account(session.auth.actor)
        if (account.core_liquid_balance) {
            balance = account.core_liquid_balance
        } else {
            ([balance] = await session.client.v1.chain.get_currency_balance($activeBlockchain.coreTokenContract, session.auth.actor))
        }

        if ($activeBlockchain.id === 'fio') {
            // If this is FIO, load the transfer fee
            loadFee()
        } else {
            // Otherwise reset the fee to 0
            txfee = Asset.fromUnits(0, $activeBlockchain.coreTokenSymbol)
        }
        return account
    }

    async function loadFee() {
        const fees = await $activeSession!.client.v1.chain.get_table_rows({
            code: 'fio.fee',
            table: 'fiofees',
            scope: 'fio.fee',
            key_type: 'i64',
            index_position: 'primary',
            lower_bound: UInt64.from(5),
            upper_bound: UInt64.from(5),
            limit: 1,
        })
        txfee = Asset.fromUnits(fees.rows[0].suf_amount, $activeBlockchain.coreTokenSymbol)
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
        let data
        switch ($activeBlockchain.id) {
            case "fio": {
                const max_fee = await loadFee()
                data = FIOTransfer.from({
                    payee_public_key: toAddress,
                    amount: quantity.units,
                    max_fee,
                    actor: $activeSession!.auth.actor, 
                    tpid: 'tpid@greymass',
                })
                break
            }
            default: {
                data = Transfer.from({
                    from: $activeSession!.auth.actor,
                    to: toAccount,
                    quantity,
                    memo,
                })
                break
            }
        }
        await $activeSession!.transact({
            action: {
                authorization: [$activeSession!.auth],
                account: $activeBlockchain.coreTokenContract,
                name: $activeBlockchain.coreTokenTransfer,
                data,
            },
        })
        // adjust balance to reflect transfer
        switch ($activeBlockchain.id) {
            case "fio": {
                balance.units = UInt64.from(
                    balance.units.toNumber() - Asset.from(quantity).units.toNumber() - Asset.from(txfee).units.toNumber()
                )
                break
            }
            default: {
                balance.units = UInt64.from(
                    balance.units.toNumber() - Asset.from(quantity).units.toNumber()
                )
                break
            }
        }
    }
</script>

<style>
table td {
    text-align: right;
}
</style>

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
            <input type="text" bind:value={value} />
            to
            {#if $activeBlockchain.id === 'fio'}
                <input type="text" bind:value={toAddress} />
            {:else}
                <input type="text" bind:value={toAccount} />
                with memo
                <input type="text" bind:value={memo} />
            {/if}
            {#if txfee.value > 0}
                <table border="1">
                    <tr>
                        <td>Sending:</td>
                        <td>{quantity}</td>
                    </tr>
                    <tr>
                        <td>Fee:</td>
                        <td>{txfee}</td>
                    </tr>
                    <tr>
                        <td>Total:</td>
                        <td>{Asset.fromUnits(quantity.units.toNumber() + txfee.units.toNumber(), $activeBlockchain.coreTokenSymbol)}</td>
                    </tr>
                </table>
            {/if}
            <button on:click={transfer}>go</button>
        </p>
    {/await}
</Page>
