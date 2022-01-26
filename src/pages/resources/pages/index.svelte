<script lang="ts">
    import type {Readable} from 'svelte/store'
    import {derived} from 'svelte/store'

    import {ChainFeatures} from '~/config'
    import {activeBlockchain} from '~/store'

    import ResourceStateCPU from '~/pages/resources/components/state/cpu.svelte'
    import ResourceStateNET from '~/pages/resources/components/state/net.svelte'
    import ResourceStateRAM from '~/pages/resources/components/state/ram.svelte'

    import Button from '~/components/elements/button.svelte'
    import Text from '~/components/elements/text.svelte'

    const {BuyRAM, PowerUp, REX, Staking} = ChainFeatures

    const hasBuyRAM: Readable<boolean | undefined> = derived(
        activeBlockchain,
        ($activeBlockchain) => {
            return $activeBlockchain && $activeBlockchain.chainFeatures.has(BuyRAM)
        }
    )

    const hasPowerUp: Readable<boolean | undefined> = derived(
        activeBlockchain,
        ($activeBlockchain) => {
            return $activeBlockchain && $activeBlockchain.chainFeatures.has(PowerUp)
        }
    )

    const hasREX: Readable<boolean | undefined> = derived(activeBlockchain, ($activeBlockchain) => {
        return $activeBlockchain && $activeBlockchain.chainFeatures.has(REX)
    })

    const hasStaking: Readable<boolean | undefined> = derived(
        activeBlockchain,
        ($activeBlockchain) => {
            return $activeBlockchain && $activeBlockchain.chainFeatures.has(Staking)
        }
    )
</script>

<style type="scss">
    .wrapper {
        margin: 16px 0;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 25px;
    }
    .buttons {
        display: flex;
        justify-content: center;
        margin-top: 20px;
        & > :global(*) {
            min-width: 80px;
            margin-left: 15px;
            margin-right: 15px;
        }
    }
    @media only screen and (max-width: 999px) {
        .wrapper {
            margin: 16px;
        }
    }
</style>

<div class="wrapper">
    <ResourceStateRAM>
        {#if $hasBuyRAM}
            <div class="buttons">
                <Button style="no-frame" href="/resources/ram/buy">
                    <Text>BUY</Text>
                </Button>
                <Button style="no-frame" href="/resources/ram/sell">
                    <Text>SELL</Text>
                </Button>
            </div>
        {/if}
    </ResourceStateRAM>
    <ResourceStateCPU>
        <div class="buttons">
            {#if $hasREX || $hasPowerUp}
                <Button style="no-frame" href="/resources/cpu">
                    <Text>RENT</Text>
                </Button>
            {:else if $hasStaking}
                <Button style="no-frame" href="/resources/cpu/stake">
                    <Text>STAKE</Text>
                </Button>
            {/if}
        </div>
    </ResourceStateCPU>
    <ResourceStateNET>
        <div class="buttons">
            {#if $hasREX || $hasPowerUp}
                <Button style="no-frame" href="/resources/net">
                    <Text>RENT</Text>
                </Button>
            {:else if $hasStaking}
                <Button style="no-frame" href="/resources/net/stake">
                    <Text>STAKE</Text>
                </Button>
            {/if}
        </div>
    </ResourceStateNET>
</div>
