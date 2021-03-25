<script lang="ts">
    import {currentAccount} from '~/store'

    import Button from '~/components/elements/button.svelte'
    import FormTransaction from '~/components/elements/form/transaction.svelte'
    import Icon from '~/components/elements/icon.svelte'
    import Text from '~/components/elements/text.svelte'

    import ResourceStateRAM from '~/pages/resources/components/state/ram.svelte'
    import RAMSell from '~/pages/resources/components/forms/ramsell.svelte'
</script>

<style type="scss">
</style>

{#if $currentAccount}
    <ResourceStateRAM showExtra>
        <Button href="/resources">
            <Icon name="arrow-left" />
            <Text>Back to Resources</Text>
        </Button>
        <Button primary href="/resources/ram/buy">
            <Icon name="hard-drive" />
            <Text>Buy RAM</Text>
        </Button>
    </ResourceStateRAM>
    <FormTransaction>
        <RAMSell />
    </FormTransaction>
{/if}
