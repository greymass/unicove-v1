<script lang="ts">
    import FormTransaction from '~/components/elements/form/transaction.svelte'
    import ResourceStateNET from '~/pages/resources/components/state/net.svelte'
    import ResourcesFuel from '~/pages/resources/components/forms/fuel.svelte'
</script>

<style>
</style>

<ResourceStateNET showExtra />
<FormTransaction>
    <ResourcesFuel />
</FormTransaction>
