<script lang="ts">
    import type {API, LinkSession} from 'anchor-link'
    import {Asset, UInt64} from '@greymass/eosio'

    import {activeSession} from '../../store'
    import {featureEnabled, ChainFeatures} from '../../config'
    import {REXDeposit, REXRentCPU, REXRentNET} from '../../abi-types'

    import Page from '../../components/page.svelte'
    import ResourcesNavigation from '../../components/resources/navigation.svelte'

    let account:API.v1.AccountObject
    let sampleAccount:API.v1.AccountObject

    // Internal values
    let coreSymbol = Asset.Symbol.from('4,EOS')
    let balance: Asset = Asset.fromUnits(0, coreSymbol)
    let totalRent: Asset = Asset.fromUnits(0, coreSymbol)
    let totalUnlent: Asset = Asset.fromUnits(0, coreSymbol)
    let price: number = 0
    let cpuToReceive: Asset = Asset.fromUnits(0, coreSymbol)
    let netToReceive: Asset = Asset.fromUnits(0, coreSymbol)

    let rentNET = false
    let rentCPU = true

    let rentSplitNET = 0.1
    let rentSplitNETFloor = 0.0001
    let rentSplitNETCeiling = 0.0002
    let rentSplitCPU = 0.9
    let rentSplitCPUFloor = 0.0001
    let estimatedTransfers:string = '0'
    
    // User entered payment amount
    let payment = '0.0020'

    // Asset representation of user entered amount
    let amount = Asset.fromFloat(parseFloat(payment), coreSymbol)

    // Asset representation of the user entered amount to each resource
    let amountCPU = Asset.fromFloat(parseFloat(payment), coreSymbol)
    let amountNET = Asset.fromFloat(parseFloat(payment), coreSymbol)
    
    // TODO: we need some sort of global account store/cache instead of pulling it every page load
    async function loadAccount(session: LinkSession) {
        balance = Asset.fromUnits(0, coreSymbol)
        account = await session.client.v1.chain.get_account(session.auth.actor)
        if (account.core_liquid_balance) {
            coreSymbol = account.core_liquid_balance.symbol
            balance = account.core_liquid_balance
        }
        return account
    }

    async function loadSampleAccount(session: LinkSession) {
        sampleAccount = await session.client.v1.chain.get_account('teamgreymass')
        return sampleAccount
    }

    async function loadTables(session: LinkSession) {
        const results = await session.client.v1.chain.get_table_rows({
            code: 'eosio',
            scope: 'eosio',
            table: 'rexpool',
        })
        if (results.rows) {
            const [row] = results.rows
            totalRent = Asset.from(row.total_rent)
            totalUnlent = Asset.from(row.total_unlent)
            price = totalRent.value / totalUnlent.value
        }
        return results
    }

    // load account based on active session
    $: loading = (
        loadAccount($activeSession!)
        && loadSampleAccount($activeSession!)
        && loadTables($activeSession!)
    )

    // TODO: find or build some form builder and validation instead
    //       sextant admin ui has the beginnings of one that can handle core types we could build on
    $: {
        let value = parseFloat(payment)
        if (!sampleAccount || !account || isNaN(value) || value === 0) {
            amount = Asset.fromUnits(0, coreSymbol)
            amountCPU = Asset.fromUnits(0, coreSymbol)
            amountNET = Asset.fromUnits(0, coreSymbol)
            cpuToReceive = Asset.fromUnits(0, coreSymbol)
            netToReceive = Asset.fromUnits(0, coreSymbol)
        } else {
            amount = Asset.fromFloat(value, coreSymbol)
            if (price) {
                // Determine if the account needs to also rent NET
                if (account.net_limit.available.value < 1000) {
                    rentNET = true
                    // If true, split the entered amount by the defined split
                    amountCPU = Asset.fromFloat(amount.value * rentSplitCPU, coreSymbol)
                    amountNET = Asset.fromFloat(amount.value - amountCPU.value, coreSymbol)
                    // If the split is below the floor, readjust to set it to the floor
                    if (amountNET.value < rentSplitNETFloor) {
                        amountCPU = Asset.fromFloat(amount.value - rentSplitNETFloor, coreSymbol)
                        amountNET = Asset.fromFloat(rentSplitNETFloor, coreSymbol)
                    }
                    // If the split is above the ceiling, readjust to set to the ceiling
                    if (amountNET.value > rentSplitNETCeiling) {
                        amountCPU = Asset.fromFloat(amount.value - rentSplitNETCeiling, coreSymbol)
                        amountNET = Asset.fromFloat(rentSplitNETCeiling, coreSymbol)
                    }
                    // Calculate the amount of CPU and NET to receive
                    cpuToReceive = Asset.fromFloat(amountCPU.value / price, coreSymbol)
                    netToReceive = Asset.fromFloat(amountNET.value / price, coreSymbol)
                    // Estimate the number of token transfer this amount would allow
                    const resourceCost = sampleAccount.cpu_limit.max.value / sampleAccount.total_resources.cpu_weight.value
                    estimatedTransfers = (resourceCost * cpuToReceive.value / 200).toFixed(1)
                } else {
                    rentNET = false
                    amountCPU = Asset.fromFloat(amount.value, coreSymbol)
                    amountNET = Asset.fromFloat(0, coreSymbol)
                    cpuToReceive = Asset.fromFloat(amount.value / price, coreSymbol)
                    netToReceive = Asset.fromFloat(0, coreSymbol)
                    estimatedTransfers = '0'
                }
            }
        }
    }

    async function rent() {
        const actions = [{
            authorization: [$activeSession!.auth],
            account: 'eosio',
            name: 'deposit',
            data: REXDeposit.from({
                owner: $activeSession!.auth.actor,
                amount,
            }),
        }]
        // If this transaction should rent CPU, append to actions
        if (rentCPU) {
            actions.push({
                authorization: [$activeSession!.auth],
                account: 'eosio',
                name: 'rentcpu',
                data: REXRentCPU.from({
                    from: $activeSession!.auth.actor,
                    receiver: $activeSession!.auth.actor,
                    loan_payment: amount,
                    loan_fund: Asset.fromUnits(0, coreSymbol)
                }),
            })
        }
        // If this transaction should rent NET, append to actions
        if (rentNET) {
            actions.push({
                authorization: [$activeSession!.auth],
                account: 'eosio',
                name: 'rentnet',
                data: REXRentNET.from({
                    from: $activeSession!.auth.actor,
                    receiver: $activeSession!.auth.actor,
                    loan_payment: Asset.fromUnits(0, coreSymbol), //payment,
                    loan_fund: Asset.fromUnits(0, coreSymbol)
                }),
            })
        }
        await $activeSession!.transact({actions})
        // adjust balance to reflect transfer
        balance.units = UInt64.from(
            balance.units.toNumber() - Asset.from(payment).units.toNumber()
        )
    }
</script>

<style>

</style>

<Page title="Resources - REX">
    <ResourcesNavigation />
    {#if featureEnabled($activeSession, ChainFeatures.REX)}
        {#await loading}
            <p>Hang on, fetching balances and stuff...</p>
        {:then _}
            <p>You have <i on:click={() => (payment = String(balance))}> {balance} </i></p>
            <p>
                Rent Resources by paying
            </p>
            <p>
                <input type="text" bind:value={payment} />
                <button on:click={rent}>go</button>
            </p>
            <p>
                Form value interpretted: {String(amount)}
            </p>
            <p>
                Current Price: {price}
            </p>
            <p>
                You will pay the following for each resource:
            </p>
            <ul>
                <li>{amountCPU} towards CPU</li>
                <li>{amountNET} towards NET</li>
            </ul>
            <p>
                You will receive approximately:
            </p>
            <ul>
                <li>{cpuToReceive} as staked CPU</li>
                <li>{netToReceive} as staked NET</li>
            </ul>
            <p>Which is an amount capable of performing {estimatedTransfers} token transfers (based on ~200μs per transfer).</p>
        {/await}
    {:else}
        <p>This feature is unavailable on this blockchain.</p>
    {/if}
</Page>
