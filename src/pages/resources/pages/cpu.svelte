<script lang="ts">
    import {currentAccount} from '~/store'
    import {powerupPrice, rexPrice, stakingPrice} from '~/pages/resources/resources'

    import Button from '~/components/elements/button.svelte'
    import Icon from '~/components/elements/icon.svelte'
    import Text from '~/components/elements/text.svelte'
    import Segment from '~/components/elements/segment.svelte'
    import SegmentGroup from '~/components/elements/segment/group.svelte'

    import ResourceStateCPU from '~/pages/resources/components/state/cpu.svelte'
</script>

<style type="scss">
    :global(.segment) {
        margin-top: 12px;
    }
    .offers {
        padding: 1em 0;
    }
    .offer {
        text-align: center;
    }
    .price {
        font-family: Inter;
        font-style: normal;
        font-weight: bold;
        font-size: 24px;
        line-height: 24px;
        letter-spacing: -0.47px;
        color: var(--light-black);
        margin-top: 0.25em;
    }
    .service,
    .pair {
        color: var(--light-grey);
        font-family: Inter;
        font-style: normal;
        font-weight: bold;
        font-size: 10px;
        line-height: 12px;
        letter-spacing: 0.1px;
        text-transform: uppercase;
    }
    .term {
        color: var(--light-grey);
        margin: 1em 0;
    }
    :global(p) {
        font-family: Inter;
        font-style: normal;
        font-weight: normal;
        font-size: 16px;
        line-height: 19px;
        letter-spacing: -0.26px;
        color: var(--light-grey);
        margin-bottom: 8px;
    }
</style>

{#if $currentAccount}
    <ResourceStateCPU showExtra>
        <Button href="/resources">
            <Icon name="arrow-left" />
            <Text>Back to Resources</Text>
        </Button>
    </ResourceStateCPU>

    <div class="offers">
        <h2>Prices</h2>
        <SegmentGroup>
            <Segment>
                <div class="offer">
                    <div class="service">Fuel</div>
                    <div class="price">A.BCDE</div>
                    <div class="pair">EOS/ms</div>
                    <div class="term">Prepaid/On-demand</div>
                    <Button primary href="/resources/cpu/fuel">Rent via Fuel</Button>
                </div>
            </Segment>
            <Segment>
                <div class="offer">
                    <div class="service">PowerUp</div>
                    <div class="price">
                        {$powerupPrice.value.toFixed($powerupPrice.symbol.precision)}
                    </div>
                    <div class="pair">EOS/ms</div>
                    <div class="term">Expires after 24hrs</div>
                    <Button primary href="/resources/cpu/powerup">Rent via PowerUp</Button>
                </div>
            </Segment>
            <Segment>
                <div class="offer">
                    <div class="service">REX</div>
                    <div class="price">{$rexPrice.value.toFixed($rexPrice.symbol.precision)}</div>
                    <div class="pair">EOS/ms</div>
                    <div class="term">Expires in 30 days</div>
                    <Button primary href="/resources/cpu/rex">Rent via REX</Button>
                </div>
            </Segment>
            <Segment>
                <div class="offer">
                    <div class="service">Staking</div>
                    <div class="price">
                        {(Number($stakingPrice.value) * 1000).toFixed(
                            $stakingPrice.symbol.precision
                        )}
                    </div>
                    <div class="pair">EOS/ms</div>
                    <div class="term">Never expires</div>
                    <Button primary href="/resources/cpu/stake">Stake Tokens</Button>
                </div>
            </Segment>
        </SegmentGroup>
    </div>
{/if}
