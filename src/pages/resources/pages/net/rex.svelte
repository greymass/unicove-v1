<script lang="ts">
    import FormTransaction from '~/components/elements/form/transaction.svelte'
    import ResourceStateNET from '~/pages/resources/components/state/net.svelte'
    import ResourcesSystemREX from '~/pages/resources/components/forms/rex.svelte'
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
            <ResourcesSystemREX resource="net" />
        </FormTransaction>
    </div>
</div>
