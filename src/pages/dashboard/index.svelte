<script>
    import {activeSession} from '~/store'
    import {
        currentREXBalance,
        currentDelegatedTokens,
        currentAccountBalance,
        currentAccountValue,
    } from '~/stores/account'
    import {balances, fetchBalances} from '~/stores/balances'
    import {isLoading} from '~/stores/balances-provider'
    import {systemTokenKey} from '~/stores/tokens'

    import Page from '~/components/layout/page.svelte'
    import Button from '~/components/elements/button.svelte'
    import Icon from '~/components/elements/icon.svelte'
    import Segment from '~/components/elements/segment.svelte'
    import SegmentGroup from '~/components/elements/segment/group.svelte'
    import TokenImage from '~/components/elements/image/token.svelte'

    import TokenTable from '~/pages/dashboard/table.svelte'

    const currencyFormatter = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'})
    function fiatFormat(value: number) {
        return currencyFormatter.format(value)
    }

    function refresh() {
        if ($activeSession) {
            fetchBalances($activeSession, true)
        }
    }
</script>

<style type="scss">
    .container {
        margin-top: 16px;
    }

    .balances {
        :global(.segment) {
            display: flex;
            align-items: center;
        }
        .info {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
        }
        .label {
            font-weight: bold;
            font-size: 10px;
            line-height: 12px;
            letter-spacing: 0.1px;
            text-transform: uppercase;
            color: var(--main-black);
        }
        .amount {
            font-size: 20px;
            line-height: 24px;
            /* identical to box height */
            margin: 10px 0 6px;
            color: var(--black);
        }
        .symbol {
            font-size: 16px;
            line-height: 19px;
            color: var(--black);
        }
        .icon {
            width: 60px;
            line-height: 60px;
            font-size: 38px;
            font-weight: 300;
            text-align: center;
            color: #000000;
            background: #ffffff;
            border-radius: 50%;
        }
    }

    .options {
        text-align: right;
    }

    @media only screen and (max-width: 999px) {
        .balances {
            padding: 0 25px;
        }
    }
</style>

<Page title="Account" subtitle={String($activeSession?.auth.actor)}>
    <span slot="header">
        <div class="options">
            <Button on:action={refresh}>
                <Icon spin={$isLoading} name="refresh-cw" />
            </Button>
        </div>
    </span>
    {#if $balances}
        <div class="container">
            <div class="balances">
                <SegmentGroup>
                    <Segment background="image">
                        <div class="info">
                            <span class="label">
                                Total {$currentAccountBalance.symbol.name} Balance
                            </span>
                            <span class="amount">{$currentAccountBalance.value}</span>
                            <span class="symbol">{$currentAccountBalance.symbol.name}</span>
                        </div>
                        <div class="image">
                            <TokenImage width="60" height="60" tokenKey={$systemTokenKey} />
                        </div>
                    </Segment>
                    <Segment background="image-alt">
                        <div class="info">
                            <span class="label">Account Value</span>
                            <span class="amount">{fiatFormat($currentAccountValue)}</span>
                            <span class="symbol">USD</span>
                        </div>
                        <div class="icon">$</div>
                    </Segment>
                </SegmentGroup>
            </div>
            <TokenTable {balances} {currentREXBalance} {currentDelegatedTokens} />
        </div>
    {/if}
</Page>
