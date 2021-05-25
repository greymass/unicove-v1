<script lang="ts">
    import FormTransaction from '~/components/elements/form/transaction.svelte'
    import ResourceStateCPU from '~/pages/resources/components/state/cpu.svelte'
    import ResourcesFuel from '~/pages/resources/components/forms/fuel.svelte'
</script>

<style>
</style>

<ResourceStateCPU showExtra />
<FormTransaction>
    <ResourcesFuel />
</FormTransaction>
