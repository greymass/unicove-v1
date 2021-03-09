<script lang="ts">
    import {currentAccount} from '~/store'

    import Wrapper from './index.svelte'

    export let showExtra = false

    const precision = 2
</script>

<Wrapper icon="cpu" {showExtra}>
    <h4>CPU</h4>
    <h3>
        {(Number($currentAccount?.cpu_limit.available) / 1000).toFixed(precision)} ms
    </h3>
    <p>
        {(
            (Number($currentAccount?.cpu_limit.used) / Number($currentAccount?.cpu_limit.max)) *
            100
        ).toFixed(1)}% Used
    </p>
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
