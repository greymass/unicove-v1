<script lang="ts">
    import {currentAccount} from '~/store'

    import Button from '~/components/elements/button.svelte'
    import Icon from '~/components/elements/icon.svelte'
    import Text from '~/components/elements/text.svelte'

    import ResourceStateRAM from '~/pages/resources/components/state/ram.svelte'
</script>

<style type="scss">
</style>

{#if $currentAccount}
    <ResourceStateRAM showExtra>
        <Button href="/resources">
            <Icon name="arrow-left" />
            <Text>Back to Resources</Text>
        </Button>
    </ResourceStateRAM>
{/if}
