<script lang="ts">
    import ResourceStateCPU from '~/pages/resources/components/state/cpu.svelte'
    import ResourceStatePrices from '~/pages/resources/components/state/prices.svelte'
</script>

<style type="scss">
</style>

<ResourceStateCPU showExtra />
<ResourceStatePrices resource="cpu" />
