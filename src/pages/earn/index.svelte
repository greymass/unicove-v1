<script>
    // import {derived} from 'svelte/store'
    // import type {Readable} from 'svelte/store'

    // import {activeSession, activeBlockchain} from '~/store'
    // import {balances, fetchBalances} from '~/stores/balances'
    // import {getToken} from '~/stores/tokens'
    // import {priceTicker} from '~/price-ticker'

    import Page from '~/components/layout/page.svelte'
    // import Button from '~/components/elements/button.svelte'
    // import Icon from '~/components/elements/icon.svelte'

    // import {isLoading} from '~/stores/balancesProvider'

    // const price = priceTicker($activeBlockchain).catch((error) => {
    //     console.warn(`Unable to load price on ${$activeBlockchain.id}`, error)
    // })

    // let totalUsdValue: Readable<number> = derived(
    //     [activeSession, balances, price],
    //     ([$activeSession, $balances, $price]) => {
    //         let value = 0
    //         if ($activeSession && $balances && $price) {
    //             $balances
    //                 .filter((record) => record.account.equals($activeSession.auth.actor))
    //                 .map((record) => {
    //                     const token = getToken(record.tokenKey)
    //                     if (token && token.price) {
    //                         value += record.quantity.value * token.price
    //                     }
    //                 })
    //         }
    //         return value
    //     }
    // )

    // function fiatFormat(value: number) {
    //     const fiatSymbol = '$'
    //     const fiatName = 'USD'
    //     return `${fiatSymbol}${value.toFixed(4)} ${fiatName}`
    // }

    // function refresh() {
    //     if ($activeSession) {
    //         fetchBalances($activeSession, true)
    //     }
    // }
</script>

<style type="scss">
    p {
        margin: 1.25em 0;
    }
    ul {
        li {
            list-style: circle;
            margin-left: 1em;
        }
    }
</style>

<Page title="Earn">
    <span slot="controls">
        <div class="options">
            <!-- <Button on:action={refresh}>
                <Icon loading={$isLoading} name="refresh-cw" />
            </Button> -->
        </div>
    </span>
    <p>
        Goal of the page is for users who are getting started with EOS for the first time to earn
        based on the tokens they own. Imagine the user is brand new to EOSIO and has just created an
        account through Anchor for the first time. They purchased tokens on an exchange, what's
        next? Deposit to REX for long term holdings, earn a yield, potentially use a proxy like ours
        (to support us) or eosnation (to earn more).
    </p>
    <p>The value of these staked tokens is XX</p>
    <p>You have XX tokens staked (REX)</p>
    <p>
        [conditional] you have XX legacy staked tokens (old staking, delegations - encourage to
        remove).
    </p>
    <p>You have XX liquid tokens</p>
    <p>Total account value</p>
    <p>Potential charts showing value over time</p>
    <p>Links to more info?</p>
    <p>Controls:</p>
    <ul>
        <li>Deposit (deposit into rex)</li>
        <li>Withdraw (withdraw from rex)</li>
        <li>
            Proxy Selection (defaults to current vote, if no current vote use greymassvote proxy or
            select another)
        </li>
        <li>[conditional] Deposit Legacy (stake -> rex)</li>
        <li>[conditional] Withdraw Legacy (unstake)</li>
        <li>[conditional] Withdraw Legacy (undelegate)</li>
    </ul>
</Page>
