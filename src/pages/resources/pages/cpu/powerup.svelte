<script lang="ts">
    import Button from '~/components/elements/button.svelte'
    import Icon from '~/components/elements/icon.svelte'
    import Text from '~/components/elements/text.svelte'

    import ResourceStateCPU from '~/pages/resources/components/state/cpu.svelte'
    import ResourcesSystemPowerUp from '~/pages/resources/components/forms/powerup.svelte'
</script>

<style>
</style>

<ResourceStateCPU showExtra>
    <Button href="/resources/cpu">
        <Icon name="arrow-left" />
        <Text>Back to CPU Options</Text>
    </Button>
</ResourceStateCPU>

<ResourcesSystemPowerUp resource="cpu" />
