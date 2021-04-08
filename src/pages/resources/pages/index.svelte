<script lang="ts">
    import ResourceStateCPU from '~/pages/resources/components/state/cpu.svelte'
    import ResourceStateNET from '~/pages/resources/components/state/net.svelte'
    import ResourceStateRAM from '~/pages/resources/components/state/ram.svelte'

    import {currentAccount} from '~/store'

    import Button from '~/components/elements/button.svelte'
    import Icon from '~/components/elements/icon.svelte'
    import Text from '~/components/elements/text.svelte'
    import Segment from '~/components/elements/segment.svelte'
    import SegmentGroup from '~/components/elements/segment/group.svelte'
</script>

<style type="scss">
</style>

{#if $currentAccount}
    <SegmentGroup>
        <ResourceStateRAM>
            <Button primary href="/resources/ram/buy">
                <Text>Buy RAM</Text>
                <Icon name="hard-drive" />
            </Button>
            <Button primary href="/resources/ram/sell">
                <Text>Sell RAM</Text>
                <Icon name="hard-drive" />
            </Button>
        </ResourceStateRAM>
        <ResourceStateCPU>
            <Button primary href="/resources/cpu">
                <Text>Rent CPU</Text>
                <Icon name="cpu" />
            </Button>
        </ResourceStateCPU>
        <ResourceStateNET>
            <Button primary href="/resources/net">
                <Text>Rent NET</Text>
                <Icon name="wifi" />
            </Button>
        </ResourceStateNET>
    </SegmentGroup>
{/if}
