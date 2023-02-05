<script>
    import {Asset} from '@greymass/eosio'
    import {derived} from 'svelte/store'
    import type {Readable} from 'svelte/store'

    import {getClient} from '~/api-client'
    import {DelegatedBandwidth} from '~/abi-types'
    import {ChainFeatures} from '~/config'

    import {activeSession, activeBlockchain, currentAccount, activePriceTicker} from '~/store'
    import {balances, fetchBalances} from '~/stores/balances'
    import {isLoading} from '~/stores/balances-provider'
    import {getToken, systemTokenKey} from '~/stores/tokens'
    import {stateREX} from '~/pages/resources/resources'

    import Page from '~/components/layout/page.svelte'
    import Button from '~/components/elements/button.svelte'
    import Icon from '~/components/elements/icon.svelte'
    import Segment from '~/components/elements/segment.svelte'
    import SegmentGroup from '~/components/elements/segment/group.svelte'
    import TokenImage from '~/components/elements/image/token.svelte'

    import TokenTable from '~/pages/dashboard/table.svelte'

    interface Delegations {
        rows: DelegatedBandwidth[]
    }

    const delegations: Readable<Delegations> = derived(
        [activeBlockchain, currentAccount],
        ([$activeBlockchain, $currentAccount], set) => {
            if (
                $activeBlockchain &&
                $activeBlockchain.chainFeatures.has(ChainFeatures.Staking) &&
                $currentAccount
            ) {
                getClient($activeBlockchain.chainId)
                    .v1.chain.get_table_rows({
                        code: 'eosio',
                        table: 'delband',
                        scope: $currentAccount.account_name,
                        type: DelegatedBandwidth,
                    })
                    .then((result) => {
                        set(result)
                    })
                    .catch((err) => {
                        console.warn('Error retrieving delegations', err)
                        set({rows: []})
                    })
            }
        }
    )

    const delegatedTokens = derived(
        [currentAccount, delegations],
        ([$currentAccount, $delegations]) => {
            let delegated = 0
            if ($currentAccount && $delegations && $delegations.rows.length > 0) {
                $delegations.rows
                    .filter((record) => record.from.equals($currentAccount.account_name))
                    .forEach((record) => {
                        delegated += record.cpu_weight.value
                        delegated += record.net_weight.value
                    })
            }
            return delegated
        }
    )

    const rexTokens: Readable<number> = derived(
        [currentAccount, stateREX],
        ([$currentAccount, $stateREX]) => {
            if ($currentAccount && $currentAccount.rex_info && $stateREX && $stateREX.value) {
                return $stateREX.value * $currentAccount.rex_info.rex_balance.value
            }
            return 0
        }
    )

    const totalUsdValue: Readable<number> = derived(
        [balances, currentAccount, delegatedTokens, activePriceTicker, rexTokens],
        ([$balances, $currentAccount, $delegated, $price, $rex]) => {
            let value = 0
            if ($currentAccount && $price !== undefined) {
                value += $rex * $price
                value += $delegated * $price
                $balances
                    .filter((record) => record.account.equals($currentAccount.account_name))
                    .map((record) => {
                        const token = getToken(record.tokenKey)
                        if (token && token.price) {
                            value += record.quantity.value * token.price
                        }
                    })
            }
            return value
        }
    )

    const totalSystemTokens: Readable<Asset> = derived(
        [balances, currentAccount, delegatedTokens, rexTokens, systemTokenKey],
        ([$balances, $currentAccount, $delegated, $rex, $systemTokenKey]) => {
            let amount = 0
            if ($currentAccount) {
                $balances
                    .filter(
                        (record) =>
                            record.account.equals($currentAccount.account_name) &&
                            record.tokenKey === $systemTokenKey
                    )
                    .map((record) => {
                        amount += record.quantity.value
                    })
            }
            if ($delegated) {
                amount += $delegated
            }
            if ($rex) {
                amount += $rex
            }
            return Asset.from(amount, $activeBlockchain.coreTokenSymbol)
        }
    )

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
                                Total {$totalSystemTokens.symbol.name} Balance
                            </span>
                            <span class="amount">{$totalSystemTokens.value}</span>
                            <span class="symbol">{$totalSystemTokens.symbol.name}</span>
                        </div>
                        <div class="image">
                            <TokenImage width="60" height="60" tokenKey={$systemTokenKey} />
                        </div>
                    </Segment>
                    <Segment background="image-alt">
                        <div class="info">
                            <span class="label">Account Value</span>
                            <span class="amount">{fiatFormat($totalUsdValue)}</span>
                            <span class="symbol">USD</span>
                        </div>
                        <div class="icon">$</div>
                    </Segment>
                </SegmentGroup>
            </div>
            <TokenTable {balances} {rexTokens} {delegatedTokens} />
        </div>
    {/if}
</Page>
