<script lang="ts">
    import FormTransaction from '~/components/elements/form/transaction.svelte'
    import ResourceStateNET from '~/pages/resources/components/state/net.svelte'
    import ResourcesSystemREX from '~/pages/resources/components/forms/rex.svelte'
</script>

<style>
</style>

<ResourceStateNET showExtra />
<FormTransaction>
    <ResourcesSystemREX resource="net" />
</FormTransaction>
