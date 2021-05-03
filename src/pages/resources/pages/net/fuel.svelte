<script lang="ts">
    import Button from '~/components/elements/button.svelte'
    import Icon from '~/components/elements/icon.svelte'
    import Text from '~/components/elements/text.svelte'

    import ResourceStateNET from '~/pages/resources/components/state/net.svelte'
    import ResourcesFuel from '~/pages/resources/components/forms/fuel.svelte'
</script>

<style>
</style>

<ResourceStateNET showExtra>
    <Button href="/resources/net">
        <Icon name="arrow-left" />
        <Text>Back to NET Options</Text>
    </Button>
</ResourceStateNET>

<ResourcesFuel />
