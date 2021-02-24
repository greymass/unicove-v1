<script lang="ts">
    import {
        mspd,
        sampleAccountResponse,
        sampledCpuCost,
        sampledNetCost,
        statePowerUp,
        powerupCapacity,
        powerupPrice,
        resourcesShifted,
        rexCapacity,
        rexPrice,
    } from '~/resources'
    import {activeBlockchain, currentAccount} from '~/store'
    import Button from '~/components/elements/button.svelte'
    import Progress from '~/components/elements/progress.svelte'
    import Segment from '~/components/elements/segment.svelte'

    import CPU from '~/pages/resources/overview/cpu.svelte'
    import RAM from '~/pages/resources/overview/ram.svelte'
    // force type to be unwrapped since we cannot use typescript inside svelte templates
    $: account = $currentAccount!

    console.log(JSON.parse(JSON.stringify($currentAccount)))

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

    // const maximum = {
    //     total: $currentAccount!.cpu_limit.max.toNumber(),
    // }

    // console.log(maximum)

    // const cpu = {
    //     // CPU from rex in ms
    //     fuel: 5,
    //     // CPU from rex in ms
    //     rex: 1,
    //     // CPU from staking in ms
    //     staking: 1,
    //     // CPU from all sources in ms
    //     maximum: 1,
    // }

    // console.log(cpu)

    let things = 0
    let storage = 0
    let storageUtilization = 0
    let cpu = 0
    let staked = 0
    let rented = 0
    let powerup = 0
    let fuelFree = 0
    let fuelPrepaid = 0
    let fuelSubscription = 0

    function getCpu() {
        console.log('getCpu')
        let total = 0
        // Staked Resources + REX + PowerUp
        if ($currentAccount) {
            cpu = $currentAccount.cpu_limit.available.toNumber() / 1000

            staked = $currentAccount.total_resources.cpu_weight.value

            if ($currentAccount.self_delegated_bandwidth) {
                const self = $currentAccount.self_delegated_bandwidth.cpu_weight.value
                staked = (self / total) * cpu
                rented = (total - self) * cpu
            }

            total += cpu
        }
        // Fuel - free quota
        fuelFree = 5
        total += fuelFree
        // Fuel - prepaid quota
        fuelPrepaid = 10
        total += fuelPrepaid
        // Fuel - subscription quota
        fuelSubscription = 25
        total += fuelSubscription
        return total
    }

    function getStorage() {
        console.log('getStorage')
        let total = 0
        if (account) {
            total += (account.ram_quota.toNumber() - account.ram_usage.toNumber()) / 1000
        }
        return total
    }

    $: if (account) {
        things = getCpu()
        storage = getStorage()
    }
</script>

<style type="scss">
    :global(.segment) {
        margin: 1em 0;
    }
    table {
        margin: 2em;
        tr th,
        tr td {
            border: 1px solid black;
            font-family: Monaco, 'Courier New', Courier, monospace;
            padding: 0.5em 1em;
            &:nth-child(2),
            &:nth-child(3) {
                text-align: right;
            }
        }
    }
</style>

{#if account}
    <table>
        <thead>
            <tr>
                <th>System</th>
                <th>% of Resources</th>
                <th>% Reserved</th>
                <th>Cost</th>
            </tr>
        </thead>
        <tr>
            <td>REX</td>
            {#if $resourcesShifted}
                <td>{$resourcesShifted.toFixed(4)}%</td>
            {/if}
            {#if $rexCapacity}
                <td>{($rexCapacity * 100).toFixed(2)}%</td>
            {/if}
            {#if $rexPrice}
                <td>{$rexPrice.toFixed(4)} EOS for 1ms</td>
            {/if}
        </tr>
        <tr>
            <td>PowerUp</td>
            {#if $resourcesShifted}
                <td>{(100 - $resourcesShifted).toFixed(4)}%</td>
            {/if}
            {#if $powerupCapacity}
                <td>{($powerupCapacity * 100).toFixed(2)}%</td>
            {/if}
            {#if $powerupPrice}
                <td>{$powerupPrice.toFixed(4)} EOS for 1ms</td>
            {/if}
        </tr>
    </table>
    <p>MS/Day: {mspd}</p>
    {#if $sampleAccountResponse.account}
        <p>Sample Account Age: {$sampleAccountResponse.account.head_block_time}</p>
    {/if}
    {#if $statePowerUp}
        <p>PowerUp State: {JSON.stringify($statePowerUp)}</p>
    {/if}
    <p>Sampled CPU Cost: {$sampledCpuCost}</p>
    <p>Sampled NET Cost: {$sampledNetCost}</p>
    <CPU {account} />
    <RAM {account} />
    <Segment>
        <h2>Debugging info</h2>
        <hr />
        <p>Account Resource Utilization</p>
        <ul>
            <li>
                CPU: {(1 - account.cpu_limit.used.toNumber() / account.cpu_limit.max.toNumber()) *
                    100}% ({account.cpu_limit.used} of {account.cpu_limit.max})
            </li>
            <li>
                NET: {(1 - account.net_limit.used.toNumber() / account.net_limit.max.toNumber()) *
                    100}% ({account.net_limit.used} of {account.net_limit.max})
            </li>
            <li>
                RAM: {(1 - account.ram_usage.toNumber() / account.ram_quota.toNumber()) * 100}% ({account.ram_usage}
                of {account.ram_quota})
            </li>
        </ul>
        <hr />
        <p>Fuel Utilization</p>
        <ul>
            <li>Daily Free: 100% (5ms remaining of 5ms)</li>
            <li>Prepaid: 100% (10ms remaining of 10ms)</li>
            <li>Subscription: 100% (25ms remaining of 25ms)</li>
        </ul>
    </Segment>
{/if}
