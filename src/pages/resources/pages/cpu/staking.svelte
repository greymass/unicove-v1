<script lang="ts">
    import FormTransaction from '~/components/elements/form/transaction.svelte'
    import ResourceStateCPU from '~/pages/resources/components/state/cpu.svelte'
    import ResourcesStaking from '~/pages/resources/components/forms/staking.svelte'
</script>

<style>
</style>

<ResourceStateCPU showExtra />
<FormTransaction>
    <ResourcesStaking resource="cpu" />
</FormTransaction>
