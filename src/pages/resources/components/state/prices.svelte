<script lang="ts">
    import type {Readable} from 'svelte/store'
    import {derived} from 'svelte/store'

    import {ChainFeatures} from '~/config'
    import {activeBlockchain} from '~/store'

    import {
        cpuPowerupPrice,
        netPowerupPrice,
        cpuRexPrice,
        netRexPrice,
        cpuStakingPrice,
        netStakingPrice,
    } from '~/pages/resources/resources'

    import Button from '~/components/elements/button.svelte'
    import Segment from '~/components/elements/segment.svelte'
    import SegmentGroup from '~/components/elements/segment/group.svelte'

    export let resource = 'cpu'
    const unit = resource === 'cpu' ? 'ms' : 'kb'
    const powerupPrice = resource === 'cpu' ? cpuPowerupPrice : netPowerupPrice
    const stakingPrice = resource === 'cpu' ? cpuStakingPrice : netStakingPrice
    const rexPrice = resource === 'cpu' ? cpuRexPrice : netRexPrice

    const {PowerUp, REX, Staking} = ChainFeatures

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

    const token = derived(activeBlockchain, ($activeBlockchain) => {
        if ($activeBlockchain) {
            return String($activeBlockchain.coreTokenSymbol.name)
        }
    })
</script>

<style type="scss">
    * :global(.segment) {
        margin-top: 12px;
        background-color: transparent;
        border: 1px solid var(--divider-grey);
    }
    .offers {
        border: 1px solid var(--divider-grey);
        border-radius: 20px;
        padding: 20px;
    }
    .header {
        font-weight: bold;
        font-size: 18px;
        line-height: 22px;
    }
    .description {
        font-size: 16px;
        line-height: 19px;
        margin: 8px 0 20px 0;
    }
    h4 {
        margin-bottom: 16px;
    }
    .offer {
        text-align: center;
        :global(a span) {
            text-transform: uppercase;
        }
    }
    .price {
        margin-top: 18px;
        font-weight: bold;
        font-size: 13px;
        line-height: 16px;
        color: var(--main-black);
    }
    .service {
        font-weight: 600;
        font-size: 16px;
        line-height: 19px;
    }

    .pair {
        margin-top: 5px;
        font-weight: bold;
        font-size: 10px;
        line-height: 12px;
        color: var(--light-grey);
        text-transform: uppercase;
    }
    .term {
        margin: 15px 0 40px 0;
        color: var(--light-grey);
    }
    * :global(p) {
        font-size: 16px;
        line-height: 19px;
        color: var(--light-grey);
        margin-bottom: 8px;
    }
</style>

<div class="offers">
    <h2 class="header">Resource Provider Costs for {resource.toUpperCase()}</h2>
    <h4 class="description">
        Select a Resource Provider from the choices below to increase your {resource.toUpperCase()}.
    </h4>
    <SegmentGroup>
        <!-- <Segment>
            <div class="offer">
                <div class="service">Fuel</div>
                <div class="price">A.BCDE</div>
                <div class="pair">EOS/{resource.toUpperCase()}</div>
                <div class="term">Prepaid/On-demand</div>
                <Button no-frame href="/resources/{resource}/fuel">Rent via Fuel</Button>
            </div>
        </Segment> -->
        {#if $hasPowerUp}
            <Segment>
                <div class="offer">
                    <div class="service">Power up</div>
                    <div class="price">
                        {$powerupPrice.value.toFixed($powerupPrice.symbol.precision)}
                    </div>
                    <div class="pair">{$token} per {unit}</div>
                    <div class="term">Usable for up to <br /> 24 hours.</div>
                    <Button style="no-frame" href="/resources/{resource}/powerup"
                        >Rent via PowerUp</Button
                    >
                </div>
            </Segment>
        {/if}
        {#if $hasREX}
            <Segment>
                <div class="offer">
                    <div class="service">REX</div>
                    <div class="price">{$rexPrice.value.toFixed($rexPrice.symbol.precision)}</div>
                    <div class="pair">
                        {$token} per
                        {#if $activeBlockchain.resourceSampleMilliseconds}
                            {$activeBlockchain.resourceSampleMilliseconds}
                        {/if}
                        {unit}
                    </div>
                    <div class="term">Usable each day for <br />the next 30 days.</div>
                    <Button style="no-frame" href="/resources/{resource}/rex">Rent via REX</Button>
                </div>
            </Segment>
        {/if}
        {#if $hasStaking}
            <Segment>
                <div class="offer">
                    <div class="service">Staking</div>
                    <div class="price">
                        {$stakingPrice.value.toFixed($stakingPrice.symbol.precision)}
                    </div>
                    <div class="pair">
                        {$token} per
                        {#if $activeBlockchain.resourceSampleMilliseconds}
                            {$activeBlockchain.resourceSampleMilliseconds}
                        {/if}
                        {unit}
                    </div>
                    <div class="term">Usable each day until <br />they are unstaked.</div>
                    <Button style="no-frame" href="/resources/{resource}/stake"
                        ><span>Stake Tokens</span></Button
                    >
                </div>
            </Segment>
        {/if}
    </SegmentGroup>
</div>
