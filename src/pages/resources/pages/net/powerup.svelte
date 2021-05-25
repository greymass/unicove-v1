<script lang="ts">
    import FormTransaction from '~/components/elements/form/transaction.svelte'
    import ResourceStateNET from '~/pages/resources/components/state/net.svelte'
    import ResourcesSystemPowerUp from '~/pages/resources/components/forms/powerup.svelte'
</script>

<style>
</style>

<ResourceStateNET showExtra />
<FormTransaction>
    <ResourcesSystemPowerUp resource="net" />
</FormTransaction>
