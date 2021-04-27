import type {Asset} from 'anchor-link'
import type {ChainId, LinkSession, NameType} from 'anchor-link'
import {get, writable, Writable} from 'svelte/store'

import {chainConfig} from '~/config'

export interface Token {
    chainId: ChainId
    contract: NameType
    symbol: Asset.Symbol
    name: NameType
    price?: number
    logo?: string
}

export interface TokenKeyParams {
    chainId: ChainId
    contract: NameType
    name: NameType
}

export interface TokenRecord extends Token {
    key: string
    updated: Date
}

export interface TokensStore {
    records: TokenRecord[]
    updated: Date
}

const initialTokens: TokensStore = {
    records: [],
    updated: new Date(),
}

export const tokens: Writable<TokensStore> = writable(initialTokens)

export function makeTokenKey(token: TokenKeyParams): string {
    return [String(token.chainId), String(token.contract), String(token.name)]
        .join('-')
        .toLowerCase()
}

export function addCoreToken(session: LinkSession) {
    const chain = chainConfig(session.chainId)
    const token: Token = {
        chainId: chain.chainId,
        contract: chain.coreTokenContract,
        symbol: chain.coreTokenSymbol,
        name: chain.coreTokenSymbol.name,
        logo: `https://www.bloks.io/img/chains/${chain.coreTokenSymbol.name.toLowerCase()}.png`,
    }
    addToken(token)
}

export function addToken(token: Token): void {
    const key = makeTokenKey(token)
    const existing = get(tokens)
    const entry: TokenRecord = {
        ...token,
        key,
        updated: new Date(),
    }
    if (existing.records) {
        const index = existing.records.findIndex((t) => t.key === key)
        if (index >= 0) {
            // Merge new data with existing record
            existing.records[index] = {
                ...existing.records[index],
                ...entry,
            }
        } else {
            existing.records.push(entry)
        }
    }
    existing.updated = new Date()
    tokens.set(existing)
}

export function getToken(key: string) {
    const existing = get(tokens)
    return existing.records.find((t) => t.key === key)
}

export function updateTokenPrice(token: Token, price: number) {
    const key = makeTokenKey(token)
    const existing = get(tokens)
    const index = existing.records.findIndex((t) => t.key === key)
    if (index >= 0) {
        existing.records[index].price = price
        existing.records[index].updated = new Date()
        existing.updated = new Date()
        tokens.set(existing)
    }
}
