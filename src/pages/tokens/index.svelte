<script>
    import {derived} from 'svelte/store'
    import type {Readable} from 'svelte/store'

    import {getClient} from '~/api-client'
    import {DelegatedBandwidth} from '~/abi-types'
    import {ChainFeatures} from '~/config'

    import {activeSession, activeBlockchain, currentAccount, activePriceTicker} from '~/store'
    import {balances, fetchBalances} from '~/stores/balances'
    import {isLoading} from '~/stores/balances-provider'
    import {getToken} from '~/stores/tokens'
    import {stateREX} from '~/pages/resources/resources'

    import Page from '~/components/layout/page.svelte'
    import Button from '~/components/elements/button.svelte'
    import Icon from '~/components/elements/icon.svelte'

    import TokenTable from '~/pages/tokens/table.svelte'

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
                        console.log('error retrieving delegations', err)
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

    let totalUsdValue: Readable<number> = derived(
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

    function fiatFormat(value: number) {
        const fiatSymbol = '$'
        const fiatName = 'USD'
        return `${fiatSymbol}${value.toFixed(4)} ${fiatName}`
    }

    function refresh() {
        if ($activeSession) {
            fetchBalances($activeSession, true)
        }
    }
</script>

<style type="scss">
    .container {
        @media only screen and (min-width: 600px) {
            .buttons-container {
                display: flex;
                flex-direction: row;
                .button-container {
                    display: flex;
                    flex-direction: column;
                    width: 50%;
                    padding: 5px;
                }
            }
        }

        @media only screen and (max-width: 600px) {
            padding-bottom: 140px;
            .buttons-container {
                background: var(--main-white);
                border-top: 1px solid var(--main-grey);
                display: flex;
                flex-direction: column;
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                padding: 5px 20px;
                z-index: 1000;

                .button-container {
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    padding: 10px 0;
                }
            }
        }
    }

    .options {
        text-align: right;
    }
</style>

<Page title="Balances" subtitle={`Est. ${fiatFormat($totalUsdValue)}`}>
    <span slot="controls">
        <div class="options">
            <Button on:action={refresh}>
                <Icon loading={$isLoading} name="refresh-cw" />
            </Button>
        </div>
    </span>
    {#if $balances}
        <div class="container">
            <TokenTable {balances} {rexTokens} {delegatedTokens} />
            <div class="buttons-container">
                <div class="button-container">
                    <Button href="/transfer" size="large">Send tokens</Button>
                </div>
                <div class="button-container">
                    <Button
                        href={`https://www.${
                            $activeBlockchain?.id === 'eos' ? '' : `${$activeBlockchain?.id}.`
                        }bloks.io/account/${String($currentAccount?.account_name)}`}
                        size="large">View account on explorer</Button
                    >
                </div>
            </div>
        </div>
    {/if}
</Page>
