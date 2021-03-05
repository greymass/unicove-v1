<script lang="ts">
    import {Asset} from '@greymass/eosio'
    import {
        msToRent,
        powerupPrice,
        rexPrice,
        statePowerUp,
        stateREX,
    } from '~/pages/resources/resources'
    import Segment from '~/components/elements/segment.svelte'
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

<table>
    <thead>
        <tr>
            <th>System</th>
            <th>% of Resources</th>
            <th>% Reserved</th>
            <th>1-day cost</th>
            <th>30-day cost</th>
        </tr>
    </thead>
    <tr>
        <td>REX (+Staking)</td>
        {#if $statePowerUp}
            <td>{(100 - Number($statePowerUp.cpu.allocated) * 100).toFixed(4)}%</td>
        {/if}
        {#if $stateREX}
            <td>{(Number($stateREX.reserved) * 100).toFixed(4)}%</td>
        {/if}
        {#if $rexPrice}
            <td />
            <td>{$rexPrice}/{$msToRent}ms</td>
        {/if}
    </tr>
    <tr>
        <td>PowerUp</td>
        {#if $statePowerUp}
            <td>{(Number($statePowerUp.cpu.allocated) * 100).toFixed(4)}%</td>
        {/if}
        {#if $statePowerUp}
            <td>{(Number($statePowerUp.cpu.reserved) * 100).toFixed(4)}%</td>
        {/if}
        {#if $powerupPrice}
            <td>{$powerupPrice}/{$msToRent}ms</td>
            <td>{Asset.from($powerupPrice.value * 30, $powerupPrice.symbol)}/{$msToRent}ms</td>
        {/if}
    </tr>
</table>
<Segment>
    <h2>Debugging info</h2>
    <hr />
    <p>Account Resource Utilization</p>
    <hr />
    <p>Fuel Utilization</p>
    <ul>
        <li>Daily Free: 100% (5ms remaining of 5ms)</li>
        <li>Prepaid: 100% (10ms remaining of 10ms)</li>
        <li>Subscription: 100% (25ms remaining of 25ms)</li>
    </ul>
</Segment>
