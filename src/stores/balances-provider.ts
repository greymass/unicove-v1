import type {LinkSession} from 'anchor-link'
import {Asset} from 'anchor-link'
import {get, writable} from 'svelte/store'
import type {Writable} from 'svelte/store'

import {BalanceProviders, chainConfig} from '~/config'
import {activeSession} from '~/store'
import {makeTokenKey, Token} from '~/stores/tokens'

import {Balance, createBalanceFromToken} from '~/stores/balances'

interface RawTokenBalance {
    currency: string
    amount: number
    usd_value: number
    decimals: number
    contract: string
    metadata: {
        logo?: string
    }
}

export const isLoading: Writable<boolean> = writable(false)

interface BalancesProvider {
    balances: Balance[]
    tokens: Token[]
}

const initialBalances: BalancesProvider = {
    balances: [],
    tokens: [],
}

export const balancesProvider: Writable<BalancesProvider> = writable(initialBalances, () => {
    // Update on a set interval
    const interval = setInterval(() => {
        const session = get(activeSession)
        if (session) {
            updateBalances(session)
        }
    }, 30000)

    // Subscribe to changes to the active session and update on change
    const unsubscribe = activeSession.subscribe((session) => {
        if (session) {
            updateBalances(session)
        }
    })

    return () => {
        unsubscribe()
        clearInterval(interval)
    }
})

export async function updateBalances(session: LinkSession) {
    isLoading.set(true)
    const chain = chainConfig(session.chainId)
    const {Bloks} = BalanceProviders
    if (chain.balanceProviders?.has(Bloks)) {
        const data = await fetchData(session)
        const balances = parseTokenBalances(session, data)
        const tokens = parseTokens(session, data)
        balancesProvider.set({
            balances,
            tokens,
        })
    }
    isLoading.set(false)
}

async function fetchData(session: LinkSession) {
    const chain = chainConfig(session.chainId)
    const apiUrl = `https://www.api.bloks.io${chain.id === 'eos' ? '' : `/${chain.id}`}/account/${
        session.auth.actor
    }?type=getAccountTokens&coreSymbol=${chain.coreTokenSymbol}`

    return await fetch(apiUrl)
        .then(async (response) => {
            const jsonBody =
                response &&
                (await response.json().catch((error) => {
                    console.log(
                        'An error occured while parsing the token balances response body:',
                        {
                            error,
                        }
                    )
                }))
            return jsonBody.tokens
        })
        .catch((error) => {
            console.log('An error occured while fetching token balances:', {error})
            return []
        })
}

function parseTokenInfo(session: LinkSession, balance: RawTokenBalance): Token {
    const chain = chainConfig(session.chainId)
    const symbol: Asset.Symbol = Asset.Symbol.from(`${balance.decimals},${balance.currency}`)
    const key = makeTokenKey({
        chainId: chain.chainId,
        contract: balance.contract,
        name: symbol.name,
    })
    return {
        key,
        chainId: chain.chainId,
        contract: balance.contract,
        symbol: symbol,
        name: symbol.name,
        price: balance.usd_value / balance.amount,
        logo: balance.metadata?.logo,
    }
}

function parseTokens(session: LinkSession, balances: RawTokenBalance[]) {
    return balances.map((balance) => parseTokenInfo(session, balance))
}

function parseTokenBalances(session: LinkSession, balances: RawTokenBalance[]) {
    return balances.map((balance) => {
        const symbol: Asset.Symbol = Asset.Symbol.from(`${balance.decimals},${balance.currency}`)
        const token = parseTokenInfo(session, balance)
        const asset = Asset.from(balance.amount || 0, symbol)
        return createBalanceFromToken(session, token, asset)
    })
}
