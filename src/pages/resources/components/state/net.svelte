<script lang="ts">
    import {derived} from 'svelte/store'
    import Gauge from '~/components/elements/gauge.svelte'

    import {currentAccount} from '~/store'
    import Wrapper from './index.svelte'

    export let showExtra = false

    const precision = 2

    export const used = derived([currentAccount], ([$currentAccount]) => {
        let percentage = 100
        if ($currentAccount) {
            const max = Number($currentAccount?.net_limit.max)
            const usage = Number($currentAccount?.net_limit.used)
            percentage = isNaN(max) || isNaN(usage) ? 0 : (usage / max) * 100
            if (max === 0 || percentage > 100) {
                percentage = 100
            }
            return percentage.toFixed(1)
        } else {
            return (0).toFixed(1)
        }
    })
    $: usagePerc = (Number($currentAccount?.net_limit.available) / 1000).toFixed(precision)
</script>

<Wrapper {showExtra}>
    {#if !showExtra}
        <h4>NET</h4>
        <h3>
            {usagePerc} <span>kb</span>
        </h3>
    {/if}
    <div class="gauge">
        <Gauge icon="wifi" percentage={Number($used)} fallback="N/A" />
    </div>
    <slot />
    <div slot="extra">
        {#if showExtra}
            <h4>NET</h4>
            <h3>Resource Statistics</h3>
        {/if}
        <ul>
            <li>
                <span>Available:</span>
                <span
                    >{(Number($currentAccount?.net_limit.available) / 1000).toFixed(precision)} kb</span
                >
            </li>
            <li>
                <span>Used:</span>
                <span>
                    {(Number($currentAccount?.net_limit.used) / 1000).toFixed(precision)}<span>
                        &nbsp;kb</span
                    >
                </span>
            </li>
            <li>
                <span>Maximum:</span>
                <span>{(Number($currentAccount?.net_limit.max) / 1000).toFixed(precision)} kb</span>
            </li>
        </ul>
    </div>
</Wrapper>
