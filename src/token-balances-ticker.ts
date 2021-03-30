import {Asset} from '@greymass/eosio'

import {derived, ReadableResult} from 'svelte-result-store'

import type {LinkSession} from 'anchor-link'
import type {ChainConfig} from './config'

import {cachedRead} from '~/db'

/** How often to update prices.  */
const UPDATE_INTERVAL = 1 * 60 * 1000 // 1 minute
const MAX_AGE = 2 * 60 * 60 * 1000 // 2 hours

interface RawTokenBalance {
    currency: string
    amount: number
    usd_value: number
    decimals: number
    contract: string
}

export interface TokenBalance {
    name: string
    balance: Asset
    usdValue: Asset
    decimals: number
    symbol: Asset.Symbol
    contract: string
}

const tickerStores: Record<string, ReadableResult<{[key: string]: TokenBalance}>> = {}

/**
 * Latest token balances by chain and session.
 */
export function tokenBalancesTicker(
    session: LinkSession,
    chain: ChainConfig
): ReadableResult<{[key: string]: TokenBalance}> {
    const tickerName = `${session.auth.actor}-balances`
    if (tickerStores[tickerName]) {
        return tickerStores[tickerName]
    }

    const balances: ReadableResult<RawTokenBalance[]> = fetchBalances(tickerName, session, chain)

    const balancesByAccount = derived(balances, ($balances) => {
        return parseTokenBalances($balances)
    })

    tickerStores[tickerName] = balancesByAccount

    return balancesByAccount
}

export function fetchBalances(
    tickerName: string,
    session: LinkSession,
    chain: ChainConfig
): ReadableResult<RawTokenBalance[]> {
    const balances: ReadableResult<any[]> = cachedRead({
        store: 'price-ticker',
        key: tickerName,
        load: async () => {
            const apiUrl = `https://www.api.bloks.io${
                chain.id === 'eos' ? '' : `/${chain.id}`
            }/account/${session.auth.actor}?type=getAccountTokens&coreSymbol=${
                chain.coreTokenSymbol
            }`

            const apiResponse = await fetch(apiUrl).catch((error) => {
                console.log('An error occured while fetching token balances:', {error})
            })

            const jsonBody =
                apiResponse &&
                (await apiResponse.json().catch((error) => {
                    console.log(
                        'An error occured while parsing the token balances response body:',
                        {error}
                    )
                }))

            return jsonBody.tokens
        },
        maxAge: MAX_AGE, // 1 week
        refreshInterval: UPDATE_INTERVAL, // 1 day
    })

    return balances
}

function parseTokenBalances(tokens: RawTokenBalance[]): {[key: string]: TokenBalance} {
    const tokensBalances: {[key: string]: TokenBalance} = {}

    tokens.forEach((token) => {
        const assetSymbol: Asset.Symbol = Asset.Symbol.from(`${token.decimals},${token.currency}`)
        tokensBalances[token.currency] = {
            name: token.currency,
            balance: Asset.fromUnits(token.amount || 0, assetSymbol),
            usdValue: Asset.fromUnits(token.usd_value * 100 || 0, Asset.Symbol.from(`2,USD`)),
            decimals: token.decimals,
            symbol: assetSymbol,
            contract: token.contract,
            logo: token.metadata?.logo
        }
    })

    return {
        tokens: tokensBalances,
        totalUsdValue: calculateTotalUsdValue(tokens)
    }
}

function calculateTotalUsdValue(tokens) {
    console.log({tokens})
    return tokens.reduce((total, token) => total + (token.usd_value || 0), 0);
}
