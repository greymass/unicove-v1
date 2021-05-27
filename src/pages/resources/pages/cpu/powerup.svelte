<script lang="ts">
    import FormTransaction from '~/components/elements/form/transaction.svelte'
    import ResourceStateCPU from '~/pages/resources/components/state/cpu.svelte'
    import ResourcesSystemPowerUp from '~/pages/resources/components/forms/powerup.svelte'
</script>

<style>
    .form,
    .wrapper {
        margin: 16px 0;
    }
</style>

<div class="wrapper">
    <ResourceStateCPU showExtra />
    <div class="form">
        <FormTransaction>
            <ResourcesSystemPowerUp resource="cpu" />
        </FormTransaction>
    </div>
</div>
