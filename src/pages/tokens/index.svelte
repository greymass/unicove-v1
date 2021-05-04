<script>
    import {derived} from 'svelte/store'
    import type {Readable} from 'svelte/store'

    import {activeSession, activeBlockchain, currentAccount} from '~/store'
    import {balances, fetchBalances} from '~/stores/balances'
    import {getToken} from '~/stores/tokens'
    import {priceTicker} from '~/price-ticker'

    import Page from '~/components/layout/page.svelte'
    import Button from '~/components/elements/button.svelte'
    import Icon from '~/components/elements/icon.svelte'

    import TokenTable from '~/pages/tokens/table.svelte'
    import {isLoading} from '~/stores/balances-provider'

    const price = priceTicker($activeBlockchain).catch((error) => {
        console.warn(`Unable to load price on ${$activeBlockchain.id}`, error)
    })

    let totalUsdValue: Readable<number> = derived(
        [activeSession, balances, price],
        ([$activeSession, $balances, $price]) => {
            let value = 0
            if ($activeSession && $balances && $price) {
                $balances
                    .filter((record) => record.account.equals($activeSession.auth.actor))
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
                padding: 20px 0;

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

<Page title="Balances" subtitle={`Total ~${fiatFormat($totalUsdValue)}`}>
    <span slot="controls">
        <div class="options">
            <Button on:action={refresh}>
                <Icon loading={$isLoading} name="refresh-cw" />
            </Button>
        </div>
    </span>
    {#if $balances}
        <div class="container">
            <TokenTable {balances} />
            <div class="buttons-container">
                <div class="button-container">
                    <Button href="/transfer" size="large">Create new transfer</Button>
                </div>
                <div class="button-container">
                    <Button
                        href={`https://www.${
                            $activeBlockchain?.id === 'eos' ? '' : `${$activeBlockchain.id}.`
                        }bloks.io/account/${String($currentAccount?.account_name)}`}
                        size="large">View on block explorer</Button
                    >
                </div>
            </div>
        </div>
    {/if}
</Page>
