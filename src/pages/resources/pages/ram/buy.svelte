<script lang="ts">
    import {currentAccount} from '~/store'

    import Button from '~/components/elements/button.svelte'
    import FormTransaction from '~/components/elements/form/transaction.svelte'
    import Icon from '~/components/elements/icon.svelte'
    import Text from '~/components/elements/text.svelte'

    import ResourceStateRAM from '~/pages/resources/components/state/ram.svelte'
    import RAMBuy from '~/pages/resources/components/forms/rambuy.svelte'
</script>

<style type="scss">
</style>

{#if $currentAccount}
    <ResourceStateRAM showExtra>
        <Button primary href="/resources/ram/sell">
            <Icon name="hard-drive" />
            <Text>Sell RAM</Text>
        </Button>
    </ResourceStateRAM>
    <FormTransaction>
        <RAMBuy />
    </FormTransaction>
{/if}
