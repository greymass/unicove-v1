import { Asset } from '@greymass/eosio'

import {derived, ReadableResult} from 'svelte-result-store'

import {ChainConfig} from './config'
import {LinkSession} from "anchor-link";
import {TokensData} from "~/pages/tokens/types";
import {cachedRead} from "~/db";

/** How often to update prices.  */
const UPDATE_INTERVAL = 1 * 60 * 1000 // 1 minute
const MAX_AGE = 2 * 60 * 60 * 1000 // 2 hours

interface TokenBalance {
    currency: string,
    amount: number,
    usd_value: number,
    decimals: number
}

const tickerStores: Record<string, ReadableResult<{[key: string]: TokenBalance}>> = {}

/**
 * Latest price in USD for given chain and pair, if pair is omitted the chains core symbol is used.
 * @note Testnets will return zero for all pairs.
 */
export function tokenBalancesTicker(session: LinkSession, chain: ChainConfig): ReadableResult<{[key: string]: TokenBalance}> {
    const tickerName = `${session.auth.actor}-balances`
    if (tickerStores[tickerName]) {
        return tickerStores[tickerName]
    }

    const balances: ReadableResult<TokenBalance[]> = fetchBalances(tickerName, session, chain)

    const balancesByAccount = derived(balances, ($balances) => {
        parseTokens($balances)
    })

    tickerStores[tickerName] = balancesByAccount

    return balancesByAccount
}

export async function fetchBalances(tickerName: string, session: LinkSession, chain: ChainConfig) {
    if (!session) {
        return [];
    }

    const balances: ReadableResult<any[]> = cachedRead({
        store: 'price-ticker',
        key: tickerName,
        load: async () => {
            const apiUrl = `https://www.api.bloks.io${
                  chain.id === 'eos' ? '' : `/${chain.id}`
                }/account/${
                  session.auth.actor
                }?type=getAccountTokens&coreSymbol=${
                  chain.coreTokenSymbol
                }`

            const apiResponse = await fetch(apiUrl).catch((error) => {
                console.log('An error occured while fetching token balances:', {error})
            })

            const jsonBody = apiResponse && await apiResponse.json().catch((error) => {
                console.log('An error occured while parsing the token balances response body:', {error})
            })

            return jsonBody.tokens
        },
        maxAge: MAX_AGE, // 1 week
        refreshInterval: UPDATE_INTERVAL, // 1 day
    })

    return balances
}

function parseTokens(tokens: TokenBalance[]) : { [key: string]: TokensData } {
    const tokensData: { [key: string]: TokensData } = {}

    tokens.forEach(token => {
        tokensData[token.currency] = {
            name: token.currency,
            balance: Asset.fromUnits(token.amount || 0, Asset.Symbol.from(`${token.decimals},${token.currency}`)),
            usdValue: Asset.fromUnits(token.usd_value * 100 || 0, Asset.Symbol.from(`2,USD`)),
        }
    })

    return tokensData
}
