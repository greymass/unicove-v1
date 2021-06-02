<script lang="ts">
    import ResourceStateCPU from '~/pages/resources/components/state/cpu.svelte'
    import ResourceStatePrices from '~/pages/resources/components/state/prices.svelte'
</script>

<style type="scss">
    .form,
    .wrapper {
        margin: 16px 0;
    }
    @media only screen and (max-width: 999px) {
        .wrapper {
            margin: 16px;
        }
    }
</style>

<div class="wrapper">
    <ResourceStateCPU showExtra />
    <div class="form">
        <ResourceStatePrices resource="cpu" />
    </div>
</div>
