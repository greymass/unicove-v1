<script lang="ts">
    import {currentAccount} from '~/store'

    import FormTransaction from '~/components/elements/form/transaction.svelte'
    import RAMBuy from '~/pages/resources/components/forms/rambuy.svelte'
    import ResourceStateRAM from '~/pages/resources/components/state/ram.svelte'
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
                <RAMBuy />
            </FormTransaction>
        </div>
    {/if}
</div>
