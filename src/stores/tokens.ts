import type {ChainId, LinkSession, NameType} from 'anchor-link'
import {Asset} from 'anchor-link'
import AntelopeTokens from '@greymass/antelope-tokens'
import {derived, writable, get} from 'svelte/store'
import type {Writable, Readable, Unsubscriber} from 'svelte/store'

import {chainConfig, ChainConfig} from '~/config'
import {activeBlockchain, activePriceTicker, activeSession} from '~/store'
import {priceTicker} from '~/price-ticker'
import {Balance, balances} from '~/stores/balances'

import SystemTokens from '../lib/system-tokens.json'
import EvmTokens from '../lib/evm/data/tokens.json'
import {ramPrice} from '~/pages/resources/resources'

export interface Token {
    key: string
    chainId: ChainId
    contract: NameType
    action?: NameType
    symbol: Asset.Symbol
    name: NameType
    price?: number
    logo?: string
    balance?: Asset | string
    evm?: boolean
}

export interface TokenKeyParams {
    chainId: ChainId
    contract: NameType
    name: NameType
}

export function tokenFromBalance(balance: Balance) {
    return {
        key: balance.tokenKey,
        chainId: balance.chainId,
        contract: balance.contract,
        name: String(balance.quantity.symbol.code),
        symbol: balance.quantity.symbol,
    }
}

const initialTokens: Token[] = []

export const tokens: Writable<Token[]> = writable(initialTokens, () => {
    // Subscribe to changes to the active session and update on change
    const unsubscribeSession = activeSession.subscribe((session) => {
        if (session) {
            loadTokenMetadata(session)
        }
    })

    let unsubscribePrices: () => void | undefined
    const unsubscribeBalance = balances.subscribe((balances) => {
        const chain = get(activeBlockchain)
        if (chain) {
            unsubscribePrices = loadTokenPrices(chain, balances)
        }
    })

    return () => {
        if (unsubscribePrices) {
            unsubscribePrices()
        }
        unsubscribeBalance()
        unsubscribeSession()
    }
})

export function makeTokenKey(token: TokenKeyParams): string {
    return [String(token.chainId), String(token.contract), String(token.name)]
        .join('-')
        .replace(/[()]/g, '')
        .replace(/\s/g, '-')
        .toLowerCase()
}

export const systemTokenKey: Readable<string> = derived(activeBlockchain, ($activeBlockchain) => {
    if ($activeBlockchain) {
        const params: TokenKeyParams = {
            chainId: $activeBlockchain.chainId,
            contract: $activeBlockchain.coreTokenContract,
            name: $activeBlockchain.coreTokenSymbol.name,
        }
        return makeTokenKey(params)
    }
    return ''
})

export const systemToken: Readable<Token | undefined> = derived(
    activeBlockchain,
    ($activeBlockchain) => {
        if ($activeBlockchain) {
            return createTokenFromChainId($activeBlockchain.chainId)
        }
    }
)

export function createTokenFromChainId(
    chainId: ChainId,
    price: number | undefined = undefined
): Token {
    const chain = chainConfig(chainId)
    const token = {
        chainId: chainId,
        contract: chain.coreTokenContract,
        symbol: chain.coreTokenSymbol,
        name: chain.coreTokenSymbol.name,
        logo: `https://www.bloks.io/img/chains/${chain.coreTokenSymbol.name.toLowerCase()}.png`,
        price,
    }
    const record = {
        ...token,
        key: makeTokenKey(token),
    }
    return record
}

export function getToken(key: string) {
    const existing = get(tokens)
    return existing.find((t) => t.key === key)
}

export function loadTokenMetadata(session: LinkSession) {
    const records: Token[] = []

    const sysToken = createTokenFromChainId(session.chainId, get(activePriceTicker))
    records.push(sysToken)

    const allTokens = [...AntelopeTokens, ...EvmTokens, ...SystemTokens]

    const chain = chainConfig(session.chainId)

    for (const t of allTokens) {
        if (chain.id === t.chain) {
            if (t.supply && t.supply.precision && t.symbol) {
                const symbol: Asset.Symbol = Asset.Symbol.from(`${t.supply.precision},${t.symbol}`)
                const token = {
                    chainId: session.chainId,
                    contract: t.account,
                    symbol: symbol,
                    name: t.metadata.name,
                    logo: t.metadata.logo,
                }

                if (
                    token.symbol.equals(sysToken.symbol) &&
                    token.name !== `${sysToken.name} (EVM)`
                ) {
                    continue
                }

                records.push({
                    ...token,
                    key: makeTokenKey(token),
                })
            }
        }
    }

    tokens.set(records)
}

export function loadTokenPrices(chain: ChainConfig, currentBalances: Balance[]) {
    const unsubscribers: Unsubscriber[] = []

    for (const balance of currentBalances) {
        const token = getToken(balance.tokenKey)
        if (token) {
            const pairName = token.symbol.name.toLowerCase() + 'usd'

            const ramunsub = ramPrice.subscribe((v) => {
                if (v !== undefined) {
                    if (pairName === 'ramusd') {
                        setTokenPrice(token, v)
                    }
                }
            })
            unsubscribers.push(ramunsub)

            const unsubscribe = priceTicker(chain, pairName).value.subscribe((v) => {
                if (v !== undefined) {
                    setTokenPrice(token, v)
                }
            })
            unsubscribers.push(unsubscribe)
        }
    }
    return () => {
        for (const unsubs of unsubscribers) {
            unsubs()
        }
    }
}

export function setTokenPrice(token: Token, price: number) {
    const existing = get(tokens)
    tokens.set([...existing.filter((t) => t.key !== token.key), {...token, price: price}])
}
