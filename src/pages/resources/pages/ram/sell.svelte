<script lang="ts">
    import {currentAccount} from '~/stores/account'

    import FormTransaction from '~/components/elements/form/transaction.svelte'

    import ResourceStateRAM from '~/pages/resources/components/state/ram.svelte'
    import RAMSell from '~/pages/resources/components/forms/ramsell.svelte'
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
    <ResourceStateRAM />
    {#if $currentAccount}
        <div class="form">
            <FormTransaction>
                <RAMSell />
            </FormTransaction>
        </div>
    {/if}
</div>
