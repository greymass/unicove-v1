<script lang="ts">
    import {currentAccount} from '~/store'

    import Wrapper from './index.svelte'

    export let showExtra = false

    const precision = 2
</script>

<Wrapper icon="hard-drive" {showExtra}>
    <h4>RAM</h4>
    <h3>
        {((Number($currentAccount?.ram_quota) - Number($currentAccount?.ram_usage)) / 1000).toFixed(
            precision
        )}
    </h3>
    <p>
        {((Number($currentAccount?.ram_usage) / Number($currentAccount?.ram_quota)) * 100).toFixed(
            1
        )}% Used
    </p>
    <slot />
    <div slot="extra">
        <ul>
            <li>Resource Statistics</li>
            <li>
                Available: {(
                    (Number($currentAccount?.ram_quota) - Number($currentAccount?.ram_usage)) /
                    1000
                ).toFixed(precision)}
            </li>
            <li>
                Used: {(Number($currentAccount?.ram_usage) / 1000).toFixed(precision)}
            </li>
            <li>
                Maximum: {(Number($currentAccount?.ram_quota) / 1000).toFixed(precision)}
            </li>
        </ul>
    </div>
</Wrapper>
