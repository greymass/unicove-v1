<script lang="ts">
    import {currentAccount} from '~/store'

    import FormTransaction from '~/components/elements/form/transaction.svelte'

    import ResourceStateRAM from '~/pages/resources/components/state/ram.svelte'
    import RAMSell from '~/pages/resources/components/forms/ramsell.svelte'
</script>

<style type="scss">
</style>

<ResourceStateRAM />
{#if $currentAccount}
    <FormTransaction>
        <RAMSell />
    </FormTransaction>
{/if}
