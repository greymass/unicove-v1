<script lang="ts">
    import type {Readable} from 'svelte/store'
    import {derived} from 'svelte/store'

    import {ChainFeatures} from '~/config'
    import {activeBlockchain} from '~/store'

    import ResourceStateCPU from '~/pages/resources/components/state/cpu.svelte'
    import ResourceStateNET from '~/pages/resources/components/state/net.svelte'
    import ResourceStateRAM from '~/pages/resources/components/state/ram.svelte'

    import Button from '~/components/elements/button.svelte'
    import Icon from '~/components/elements/icon.svelte'
    import Text from '~/components/elements/text.svelte'
    import SegmentGroup from '~/components/elements/segment/group.svelte'

    const hasBuyRAM: Readable<boolean | undefined> = derived(
        activeBlockchain,
        ($activeBlockchain) => {
            return $activeBlockchain && $activeBlockchain.chainFeatures.has(ChainFeatures.BuyRAM)
        }
    )

    const hasPowerUp: Readable<boolean | undefined> = derived(
        activeBlockchain,
        ($activeBlockchain) => {
            return $activeBlockchain && $activeBlockchain.chainFeatures.has(ChainFeatures.PowerUp)
        }
    )

    const hasREX: Readable<boolean | undefined> = derived(activeBlockchain, ($activeBlockchain) => {
        return $activeBlockchain && $activeBlockchain.chainFeatures.has(ChainFeatures.REX)
    })

    const hasStaking: Readable<boolean | undefined> = derived(
        activeBlockchain,
        ($activeBlockchain) => {
            return $activeBlockchain && $activeBlockchain.chainFeatures.has(ChainFeatures.Staking)
        }
    )
</script>

<style type="scss">
    .wrapper {
        margin: 16px 0;
    }
</style>

<div class="wrapper">
    <SegmentGroup>
        <ResourceStateRAM>
            {#if $hasBuyRAM}
                <Button primary href="/resources/ram/buy">
                    <Text>Buy RAM</Text>
                    <Icon name="hard-drive" />
                </Button>
                <Button primary href="/resources/ram/sell">
                    <Text>Sell RAM</Text>
                    <Icon name="hard-drive" />
                </Button>
            {/if}
        </ResourceStateRAM>
        <ResourceStateCPU>
            {#if $hasREX || $hasPowerUp}
                <Button primary href="/resources/cpu">
                    <Text>Rent CPU</Text>
                    <Icon name="cpu" />
                </Button>
            {:else if $hasStaking}
                <Button primary href="/resources/cpu/stake">
                    <Text>Stake CPU</Text>
                    <Icon name="cpu" />
                </Button>
            {/if}
        </ResourceStateCPU>
        <ResourceStateNET>
            {#if $hasREX || $hasPowerUp}
                <Button primary href="/resources/net">
                    <Text>Rent NET</Text>
                    <Icon name="wifi" />
                </Button>
            {:else if $hasStaking}
                <Button primary href="/resources/net/stake">
                    <Text>Stake NET</Text>
                    <Icon name="wifi" />
                </Button>
            {/if}
        </ResourceStateNET>
    </SegmentGroup>
</div>
