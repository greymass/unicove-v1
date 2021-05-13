<script lang="ts">
    import {currentAccount} from '~/store'

    import FormTransaction from '~/components/elements/form/transaction.svelte'
    import RAMBuy from '~/pages/resources/components/forms/rambuy.svelte'
    import ResourceStateRAM from '~/pages/resources/components/state/ram.svelte'
</script>

<style type="scss">
</style>

<ResourceStateRAM />
{#if $currentAccount}
    <FormTransaction>
        <RAMBuy />
    </FormTransaction>
{/if}
