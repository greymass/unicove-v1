<script lang="ts">
    import Button from '~/components/elements/button.svelte'
    import Icon from '~/components/elements/icon.svelte'
    import Text from '~/components/elements/text.svelte'

    import ResourceStateNET from '~/pages/resources/components/state/net.svelte'
    import ResourcesSystemREX from '~/pages/resources/components/forms/rex.svelte'
</script>

<style>
</style>

<ResourceStateNET showExtra>
    <Button href="/resources/NET">
        <Icon name="arrow-left" />
        <Text>Back to NET Options</Text>
    </Button>
</ResourceStateNET>

<ResourcesSystemREX resource="net" />
