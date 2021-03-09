<script lang="ts">
    import Button from '~/components/elements/button.svelte'
    import Icon from '~/components/elements/icon.svelte'
    import Text from '~/components/elements/text.svelte'

    import ResourceStateNET from '~/pages/resources/components/state/net.svelte'
    import ResourcesStaking from '~/pages/resources/components/forms/staking.svelte'
</script>

<style>
</style>

<ResourceStateNET showExtra>
    <Button href="/resources/cpu">
        <Icon name="arrow-left" />
        <Text>Back to CPU Options</Text>
    </Button>
</ResourceStateNET>

<ResourcesStaking />
