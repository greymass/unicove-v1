<script lang="ts">
    import {currentAccount} from '~/store'

    import Button from '~/components/elements/button.svelte'
    import Icon from '~/components/elements/icon.svelte'
    import Text from '~/components/elements/text.svelte'

    import ResourceStateNET from '~/pages/resources/components/state/net.svelte'
    import ResourceStatePrices from '~/pages/resources/components/state/prices.svelte'
</script>

<style type="scss">
</style>

{#if $currentAccount}
    <ResourceStateNET showExtra>
        <Button href="/resources">
            <Icon name="arrow-left" />
            <Text>Back to Resources</Text>
        </Button>
    </ResourceStateNET>

    <ResourceStatePrices resource="net" />
{/if}
