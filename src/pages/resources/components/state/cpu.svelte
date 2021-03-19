<script lang="ts">
    import {derived} from 'svelte/store'

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
                console.log('set percentage')
                percentage = 100
            }
            return percentage.toFixed(1)
        }
    })
</script>

<Wrapper icon="cpu" {showExtra}>
    <h4>CPU</h4>
    <h3>
        {(Number($currentAccount?.cpu_limit.available) / 1000).toFixed(precision)}
    </h3>
    <p>
        {$used}% Used
    </p>
    <slot />
    <div slot="extra">
        <ul>
            <li>Resource Statistics</li>
            <li>
                Available: {(Number($currentAccount?.cpu_limit.available) / 1000).toFixed(
                    precision
                )}
            </li>
            <li>Used: {(Number($currentAccount?.cpu_limit.used) / 1000).toFixed(precision)}</li>
            <li>
                Maximum: {(Number($currentAccount?.cpu_limit.max) / 1000).toFixed(precision)}
            </li>
        </ul>
    </div>
</Wrapper>
