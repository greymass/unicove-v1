<script lang="ts">
    import {currentAccount} from '~/store'

    import Wrapper from './index.svelte'
</script>

<Wrapper icon="hard-drive">
    <h4>RAM</h4>
    <h3>
        {((Number($currentAccount?.ram_quota) - Number($currentAccount?.ram_usage)) / 1000).toFixed(
            2
        )} kb
    </h3>
    <p>
        {((Number($currentAccount?.ram_usage) / Number($currentAccount?.ram_quota)) * 100).toFixed(
            1
        )}% Used
    </p>
    <slot />
</Wrapper>
