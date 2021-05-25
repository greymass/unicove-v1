<script lang="ts">
    import FormTransaction from '~/components/elements/form/transaction.svelte'
    import ResourceStateCPU from '~/pages/resources/components/state/cpu.svelte'
    import ResourcesSystemREX from '~/pages/resources/components/forms/rex.svelte'
</script>

<style>
</style>

<ResourceStateCPU showExtra />
<FormTransaction>
    <ResourcesSystemREX resource="cpu" />
</FormTransaction>
