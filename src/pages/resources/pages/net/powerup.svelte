<script lang="ts">
    import FormTransaction from '~/components/elements/form/transaction.svelte'
    import ResourceStateNET from '~/pages/resources/components/state/net.svelte'
    import ResourcesSystemPowerUp from '~/pages/resources/components/forms/powerup.svelte'
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
    <ResourceStateNET showExtra />
    <div class="form">
        <FormTransaction>
            <ResourcesSystemPowerUp resource="net" />
        </FormTransaction>
    </div>
</div>
