import {writable, get} from 'svelte/store'

import {Asset} from 'anchor-link'
import type {LinkSession} from 'anchor-link'

import type {TokensData} from './pages/tokens/types'

import type {ChainConfig} from 'src/config'
import {activeBlockchain, activeSession} from 'src/store'

export const tokensData = writable<{ [key: string]: TokensData } | undefined>(undefined)

let interval: any

export function syncTokenBalances() {
    fetchBalances()
    interval = setInterval(() => {
        fetchBalances()
    }, 15 * 60 * 1000)
}

export function stopSyncTokenBalances() {
    clearInterval(interval)
}

export async function fetchBalances() {
    const session: LinkSession | undefined = get(activeSession)
    const blockchain: ChainConfig = get(activeBlockchain)

    if (!session) {
        return;
    }

    const apiUrl = `https://www.api.bloks.io${
        blockchain.id === 'eos' ? '' : `/${blockchain.id}`
    }/account/${
        session.auth.actor
    }?type=getAccountTokens&coreSymbol=${
        blockchain.coreTokenSymbol
    }`

    const apiResponse = await fetch(apiUrl).catch((error) => {
        console.log('An error occured while fetching token balances:', {error})
    })

    const jsonBody = apiResponse && await apiResponse.json().catch((error) => {
        console.log('An error occured while parsing the token balances response body:', {error})
    })

    tokensData.set(parseTokens(jsonBody.tokens))
}

interface TokenObject {
    currency: string,
    amount: number,
    usd_value: number,
    decimals: number
}

function parseTokens(tokens: TokenObject[]) : { [key: string]: TokensData } {
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
