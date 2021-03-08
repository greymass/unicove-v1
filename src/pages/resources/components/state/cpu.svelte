<script lang="ts">
    import {currentAccount} from '~/store'

    import Wrapper from './index.svelte'
</script>

<Wrapper icon="cpu">
    <h4>CPU</h4>
    <h3>
        {(Number($currentAccount?.cpu_limit.available) / 1000).toFixed(2)} ms
    </h3>
    <p>
        {(
            (Number($currentAccount?.cpu_limit.used) / Number($currentAccount?.cpu_limit.max)) *
            100
        ).toFixed(1)}% Used
    </p>
    <slot />
</Wrapper>
