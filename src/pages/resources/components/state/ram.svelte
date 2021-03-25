<script lang="ts">
    import {derived} from 'svelte/store'
    import {currentAccount} from '~/store'

    import Wrapper from './index.svelte'

    export let showExtra = false

    const precision = 3

    export const used = derived([currentAccount], ([$currentAccount]) => {
        let percentage = 100
        if ($currentAccount) {
            const max = Number($currentAccount?.ram_usage)
            const usage = Number($currentAccount?.ram_quota)
            percentage = (usage / max) * 100
            if (max === 0 || percentage > 100) {
                percentage = 100
            }
            return percentage.toFixed(1)
        }
    })
</script>

<Wrapper icon="hard-drive" {showExtra}>
    <h4>RAM</h4>
    <h3>
        {((Number($currentAccount?.ram_quota) - Number($currentAccount?.ram_usage)) / 1000).toFixed(
            precision
        )} <span>kb</span>
    </h3>
    <p>
        {#if Number($used) < 100}
            {$used}% Quota Usage
        {:else}
            No usable RAM
        {/if}
    </p>
    <slot />
    <div slot="extra">
        <ul>
            <li>Resource Statistics</li>
            <li>
                Available: {(
                    (Number($currentAccount?.ram_quota) - Number($currentAccount?.ram_usage)) /
                    1000
                ).toFixed(precision)} kb
            </li>
            <li>
                Used: {(Number($currentAccount?.ram_usage) / 1000).toFixed(precision)} kb
            </li>
            <li>
                Maximum: {(Number($currentAccount?.ram_quota) / 1000).toFixed(precision)} kb
            </li>
        </ul>
    </div>
</Wrapper>
