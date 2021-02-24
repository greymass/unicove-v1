<script lang="ts">
    import Button from '~/components/elements/button.svelte'
    import Progress from '~/components/elements/progress.svelte'
    import Segment from '~/components/elements/segment.svelte'

    // force type to be unwrapped since we cannot use typescript inside svelte templates
    export let account: any

    // mock data
    const estimates = [
        {
            contract: 'eosio.token',
            action: 'transfer',
            description: 'EOS token transfers',
            cost: 0.2,
        },
        {
            contract: 'eosio.token',
            action: 'transfer',
            description: 'trades on Newdex',
            cost: 2.1,
        },
        {
            contract: 'eosio.token',
            action: 'transfer',
            description: 'swaps on Defibox',
            cost: 3.4,
        },
    ]

    const fuelFreeCapacity = 5
    const fuelPrepaidCapacity = 0
    const fuelSubscriptionCapacity = 0

    // total ms available
    let cpu = 0

    // ms of maximum cpu
    let capacity = 0

    // ms values by source
    let staked = 0
    let rented = 0
    let fuelFree = 0
    let fuelPrepaid = 0
    let fuelSubscription = 0

    function getCpu() {
        let total = 0
        // Determine maximum capacity
        const networkCapacity = account.cpu_limit.max.toNumber() / 1000
        capacity =
            networkCapacity + fuelFreeCapacity + fuelPrepaidCapacity + fuelSubscriptionCapacity

        // Staked Resources + REX + PowerUp + Delegations
        staked = account.cpu_limit.available.toNumber() / 1000
        total += staked
        if (account.self_delegated_bandwidth) {
            // Recalculate amount derived from staked values
            const selfVsTotal =
                account.self_delegated_bandwidth.cpu_weight.value /
                account.total_resources.cpu_weight.value
            staked = total * selfVsTotal
            rented = total - staked
        } else {
            // Otherwise just assume resources are rented
            rented = staked
            staked = 0
        }
        // Fuel - free quota
        fuelFree = 5
        total += fuelFree
        // Fuel - prepaid quota
        fuelPrepaid = 0
        total += fuelPrepaid
        // Fuel - subscription quota
        fuelSubscription = 0
        total += fuelSubscription
        return total
    }

    $: if (account) {
        cpu = getCpu()
    }
</script>

<style type="scss">
    :global(.segment) {
        margin: 1em 0;
    }
    table tr td {
        text-align: right;
        padding: 0.25em;
    }
</style>

{#if account}
    <Segment>
        <h2>Quota: {Math.round(cpu)} CPU available for use</h2>
        <p>out of {capacity} maximum</p>
        <Progress percent={(cpu / capacity) * 100} />
        <hr />
        <p>Breakdown</p>
        <table>
            <tr>
                <td>Staked</td>
                <td>{Math.round(staked)} CPU</td>
            </tr>
            <tr>
                <td>Rentals</td>
                <td>{Math.round(rented)} CPU</td>
            </tr>
            <tr>
                <td>Fuel (Free)</td>
                <td>{Math.round(fuelFree)} CPU</td>
            </tr>
            <tr>
                <td>Fuel (Prepaid)</td>
                <td>{Math.round(fuelPrepaid)} CPU</td>
            </tr>
            <tr>
                <td>Fuel (Subscription)</td>
                <td>{Math.round(fuelSubscription)} CPU</td>
            </tr>
        </table>
        <p>You currently have enough resources to do...</p>
        <ul>
            {#each estimates as estimate}
                <li>
                    ~{(cpu / estimate.cost).toFixed(0)}
                    {estimate.description}
                </li>
            {/each}
        </ul>
        <hr />
        <Button primary>Buy Fuel</Button>
        <Button primary>Advanced Options</Button>
    </Segment>
{/if}
