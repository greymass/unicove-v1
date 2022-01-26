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
            const max = Number($currentAccount?.cpu_limit.max)
            const usage = Number($currentAccount?.cpu_limit.used)
            percentage = (usage / max) * 100
            if (max === 0 || percentage > 100) {
                percentage = 100
            }
            return percentage.toFixed(1)
        }
    })

    $: usagePerc = (Number($currentAccount?.cpu_limit.available) / 1000).toFixed(precision)
</script>

<Wrapper {showExtra}>
    <h4>CPU</h4>
    <h3>
        {usagePerc} <span>ms</span>
    </h3>
    <div class="gauge">
        <Gauge icon="cpu" percentage={Number($used)} fallback="No usable CPU" />
    </div>
    <slot />
    <div slot="extra">
        <ul>
            <li>Resource Statistics</li>
            <li>
                Available: {(Number($currentAccount?.cpu_limit.available) / 1000).toFixed(
                    precision
                )} ms
            </li>
            <li>Used: {(Number($currentAccount?.cpu_limit.used) / 1000).toFixed(precision)} ms</li>
            <li>
                Maximum: {(Number($currentAccount?.cpu_limit.max) / 1000).toFixed(precision)} ms
            </li>
        </ul>
    </div>
</Wrapper>
