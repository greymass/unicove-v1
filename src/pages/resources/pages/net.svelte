<script lang="ts">
    import ResourceStateNET from '~/pages/resources/components/state/net.svelte'
    import ResourceStatePrices from '~/pages/resources/components/state/prices.svelte'
</script>

<style type="scss">
    .form,
    .wrapper {
        margin: 16px 0;
    }
</style>

<div class="wrapper">
    <ResourceStateNET showExtra />
    <div class="form">
        <ResourceStatePrices resource="net" />
    </div>
</div>
