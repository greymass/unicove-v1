<script lang="ts">
    import {currentAccount} from '~/store'

    import Wrapper from './index.svelte'
</script>

<Wrapper icon="wifi">
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
</Wrapper>
