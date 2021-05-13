<script lang="ts">
    import FormTransaction from '~/components/elements/form/transaction.svelte'
    import ResourceStateNET from '~/pages/resources/components/state/net.svelte'
    import ResourcesStaking from '~/pages/resources/components/forms/staking.svelte'
</script>

<style>
</style>

<ResourceStateNET showExtra />
<FormTransaction>
    <ResourcesStaking resource="net" />
</FormTransaction>
