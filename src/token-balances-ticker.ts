import { Asset } from '@greymass/eosio'

import {derived, ReadableResult} from 'svelte-result-store'

import {LinkSession} from "anchor-link";

import {ChainConfig} from './config'
import {cachedRead} from "~/db";

/** How often to update prices.  */
const UPDATE_INTERVAL = 1 * 60 * 1000 // 1 minute
const MAX_AGE = 2 * 60 * 60 * 1000 // 2 hours

interface RawTokenBalance {
    currency: string,
    amount: number,
    usd_value: number,
    decimals: number
}

export interface TokenBalance {
    name: string,
    balance: Asset,
    usdValue: Asset,
}

const tickerStores: Record<string, ReadableResult<{[key: string]: TokenBalance}>> = {}

/**
 * Latest token balances by chain and session.
 */
export function tokenBalancesTicker(session: LinkSession, chain: ChainConfig): ReadableResult<{[key: string]: TokenBalance}> {
    const tickerName = `${session.auth.actor}-balances`
    if (tickerStores[tickerName]) {
        return tickerStores[tickerName]
    }

    const balances: ReadableResult<TokenBalance[]> = fetchBalances(tickerName, session, chain)

    const balancesByAccount = derived(balances, ($balances) => {
        return parseTokenBalances($balances)
    })

    tickerStores[tickerName] = balancesByAccount

    return balancesByAccount
}

function fetchBalances(tickerName: string, session: LinkSession, chain: ChainConfig) {
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

function parseTokenBalances(tokens: RawTokenBalance[]) : { [key: string]: TokenBalance } {
    const tokensBalances: { [key: string]: TokenBalance } = {}

    tokens.forEach(token => {
        tokensBalances[token.currency] = {
            name: token.currency,
            balance: Asset.fromUnits(token.amount || 0, Asset.Symbol.from(`${token.decimals},${token.currency}`)),
            usdValue: Asset.fromUnits(token.usd_value * 100 || 0, Asset.Symbol.from(`2,USD`)),
        }
    })

    return tokensBalances
}
