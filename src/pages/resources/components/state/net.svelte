<script lang="ts">
    import {derived} from 'svelte/store'

    import {currentAccount} from '~/store'
    import Wrapper from './index.svelte'

    export let showExtra = false

    const precision = 2

    export const used = derived([currentAccount], ([$currentAccount]) => {
        let percentage = 100
        if ($currentAccount) {
            const max = Number($currentAccount?.net_limit.max)
            const usage = Number($currentAccount?.net_limit.used)
            percentage = (usage / max) * 100
            if (max === 0 || percentage > 100) {
                console.log('set percentage')
                percentage = 100
            }
            return percentage.toFixed(1)
        }
    })
</script>

<Wrapper icon="wifi" {showExtra}>
    <h4>NET</h4>
    <h3>
        {(Number($currentAccount?.net_limit.available) / 1000).toFixed(2)} <span>kb</span>
    </h3>
    <p>
        {#if Number($used) < 100}
            {$used}% Quota Usage
        {:else}
            No usable NET
        {/if}
    </p>
    <slot />
    <div slot="extra">
        <ul>
            <li>Resource Statistics</li>
            <li>
                Available: {(Number($currentAccount?.net_limit.available) / 1000).toFixed(
                    precision
                )} kb
            </li>
            <li>Used: {(Number($currentAccount?.net_limit.used) / 1000).toFixed(precision)} kb</li>
            <li>
                Maximum: {(Number($currentAccount?.net_limit.max) / 1000).toFixed(precision)} kb
            </li>
        </ul>
    </div>
</Wrapper>
