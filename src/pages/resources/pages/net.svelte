<script lang="ts">
    import ResourceStateNET from '~/pages/resources/components/state/net.svelte'
    import ResourceStatePrices from '~/pages/resources/components/state/prices.svelte'
</script>

<style type="scss">
</style>

<ResourceStateNET showExtra />
<ResourceStatePrices resource="net" />
