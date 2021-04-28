import type {AccountName, ChainId, LinkSession, Name} from 'anchor-link'
import {Asset} from 'anchor-link'
import {get, readable, writable, Writable} from 'svelte/store'

import {ChainConfig, chainConfig} from '~/config'
import {getAccount} from '~/account-cache'
import {activeSession} from '~/store'
import {addToken, addCoreToken, makeTokenKey, Token} from '~/stores/tokens'

export interface Balance {
    key: string
    chainId: ChainId
    account: Name
    tokenKey: string
    quantity: Asset
}

export interface BalancesStore {
    records: Balance[]
    updated: Date
}

const initialBalances: BalancesStore = {
    records: [],
    updated: new Date(),
}

export const balancesStore: Writable<BalancesStore> = writable(initialBalances)

export const balances = readable<BalancesStore>(initialBalances, (set) => {
    // Set the value to equal the balances store
    const unsubscribeBalances = balancesStore.subscribe((store) => set(store))

    // Update on a set interval
    const interval = setInterval(() => fetchBalances(get(activeSession)), 30000)

    // Subscribe to changes to the active session and update on change
    const unsubscribeSession = activeSession.subscribe((session) => fetchBalances(session))

    // Return callback w/ interval clear + unsubscribes
    return () => {
        unsubscribeBalances()
        unsubscribeSession()
        clearInterval(interval)
    }
})

export function makeBalanceKey(token: Token, account: AccountName): string {
    return [
        String(token.chainId),
        String(token.contract),
        String(token.symbol.name),
        String(account),
    ]
        .join('-')
        .toLowerCase()
}

export function addCoreTokenBalance(session: LinkSession, balance: Asset) {
    // Ensure the core token is part of the token store
    addCoreToken(session)
    // Generate the token class for the core balance
    const chain = chainConfig(session.chainId)
    const token: Token = {
        chainId: session.chainId,
        contract: chain.coreTokenContract,
        symbol: chain.coreTokenSymbol,
        name: chain.coreTokenSymbol.name,
    }
    // Add the balance
    addTokenBalance(session, token, balance)
}

export function addTokenBalance(session: LinkSession, token: Token, balance: Asset): void {
    const key = makeBalanceKey(token, session.auth.actor)
    const existing: BalancesStore = get(balancesStore)
    const entry: Balance = {
        key,
        chainId: session.chainId,
        account: session.auth.actor,
        tokenKey: makeTokenKey(token),
        quantity: balance,
    }
    if (existing.records) {
        const index = existing.records.findIndex((t) => t.key === key)
        if (index >= 0) {
            existing.records[index] = entry
        } else {
            existing.records.push(entry)
        }
    }
    existing.updated = new Date()
    balancesStore.set(existing)
}

export function getBalance(key: string) {
    const existing = get(balances)
    return existing.records.find((t) => t.key === key)
}

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

export async function fetchBalances(session: LinkSession | undefined, refresh = false) {
    if (session) {
        // Refresh the account to trigger system token balance update
        getAccount(session.auth.actor, session.chainId, refresh)
        // Refresh all other token balances via bloks API
        getTokenBalances(session)
    }
}

async function getTokenBalances(session: LinkSession) {
    const chain = chainConfig(session.chainId)
    const apiUrl = `https://www.api.bloks.io${chain.id === 'eos' ? '' : `/${chain.id}`}/account/${
        session.auth.actor
    }?type=getAccountTokens&coreSymbol=${chain.coreTokenSymbol}`

    const apiResponse = await fetch(apiUrl).catch((error) => {
        console.log('An error occured while fetching token balances:', {error})
    })

    const jsonBody =
        apiResponse &&
        (await apiResponse.json().catch((error) => {
            console.log('An error occured while parsing the token balances response body:', {
                error,
            })
        }))

    parseTokenBalances(session, chain, jsonBody.tokens)
}

function parseTokenBalances(session: LinkSession, chain: ChainConfig, balances: RawTokenBalance[]) {
    balances.forEach((balance) => {
        const assetSymbol: Asset.Symbol = Asset.Symbol.from(
            `${balance.decimals},${balance.currency}`
        )
        if (balance.amount > 0) {
            // Create token representation from API response
            const token: Token = {
                chainId: chain.chainId,
                contract: balance.contract,
                symbol: assetSymbol,
                name: assetSymbol.name,
                price: balance.usd_value / balance.amount,
                logo: balance.metadata?.logo,
            }
            // Add token to global store
            addToken(token)
            // Add the users balance
            const asset = Asset.from(balance.amount || 0, assetSymbol)
            addTokenBalance(session, token, asset)
        }
    })
}
