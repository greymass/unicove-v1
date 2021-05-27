<script lang="ts">
    import FormTransaction from '~/components/elements/form/transaction.svelte'
    import ResourceStateCPU from '~/pages/resources/components/state/cpu.svelte'
    import ResourcesStaking from '~/pages/resources/components/forms/staking.svelte'
</script>

<style>
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
        <FormTransaction>
            <ResourcesStaking resource="cpu" />
        </FormTransaction>
    </div>
</div>
