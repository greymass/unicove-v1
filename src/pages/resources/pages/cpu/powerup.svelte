<script lang="ts">
    import FormTransaction from '~/components/elements/form/transaction.svelte'
    import ResourceStateCPU from '~/pages/resources/components/state/cpu.svelte'
    import ResourcesSystemPowerUp from '~/pages/resources/components/forms/powerup.svelte'
</script>

<style>
</style>

<ResourceStateCPU showExtra />
<FormTransaction>
    <ResourcesSystemPowerUp resource="cpu" />
</FormTransaction>
