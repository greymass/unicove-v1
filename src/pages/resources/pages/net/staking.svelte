<script lang="ts">
    import FormTransaction from '~/components/elements/form/transaction.svelte'
    import ResourceStateNET from '~/pages/resources/components/state/net.svelte'
    import ResourcesStaking from '~/pages/resources/components/forms/staking.svelte'
</script>

<style>
    .form,
    .wrapper {
        margin: 16px 0;
    }
</style>

<div class="wrapper">
    <ResourceStateNET showExtra />
    <div class="form">
        <FormTransaction>
            <ResourcesStaking resource="net" />
        </FormTransaction>
    </div>
</div>
