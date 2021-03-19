<script lang="ts">
    import {currentAccount} from '~/store'

    import Button from '~/components/elements/button.svelte'
    import Icon from '~/components/elements/icon.svelte'
    import Text from '~/components/elements/text.svelte'

    import ResourceStateCPU from '~/pages/resources/components/state/cpu.svelte'
    import ResourceStatePrices from '~/pages/resources/components/state/prices.svelte'
</script>

<style type="scss">
</style>

{#if $currentAccount}
    <ResourceStateCPU showExtra>
        <Button href="/resources">
            <Icon name="arrow-left" />
            <Text>Back to Resources</Text>
        </Button>
    </ResourceStateCPU>

    <ResourceStatePrices resource="cpu" />
{/if}
