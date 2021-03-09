<script lang="ts">
    import {currentAccount} from '~/store'

    import Wrapper from './index.svelte'

    export let showExtra = false

    const precision = 2
</script>

<Wrapper icon="wifi" {showExtra}>
    <h4>NET</h4>
    <h3>
        {(Number($currentAccount?.net_limit.available) / 1000).toFixed(2)} kb
    </h3>
    <p>
        {(
            (Number($currentAccount?.net_limit.used) / Number($currentAccount?.net_limit.max)) *
            100
        ).toFixed(1)}% Used
    </p>
    <slot />
    <div slot="extra">
        <ul>
            <li>Resource Statistics</li>
            <li>
                Available: {(Number($currentAccount?.net_limit.available) / 1000).toFixed(
                    precision
                )} ms
            </li>
            <li>Used: {(Number($currentAccount?.net_limit.used) / 1000).toFixed(precision)} ms</li>
            <li>
                Maximum: {(Number($currentAccount?.net_limit.max) / 1000).toFixed(precision)} ms
            </li>
        </ul>
    </div>
</Wrapper>
