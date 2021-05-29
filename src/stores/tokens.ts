import type {Asset} from 'anchor-link'
import type {ChainId, NameType} from 'anchor-link'
import {derived, get} from 'svelte/store'
import type {Readable} from 'svelte/store'
import type {Balance} from '~/stores/balances'

import {chainConfig} from '~/config'
import {activeBlockchain, activePriceTicker, activeSession} from '~/store'
import {balancesProvider} from './balances-provider'

export interface Token {
    key: string
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

export interface TokenWithBalance extends Token {
    balance: Balance
}

const initialTokens: Token[] = []

export const tokens: Readable<Token[]> = derived(
    [activePriceTicker, activeSession, balancesProvider],
    ([$activePriceTicker, $activeSession, $balancesProvider], set) => {
        const records = []

        // Push any core balance information in from the current account
        if ($activeSession) {
            records.push(createTokenFromChainId($activeSession.chainId, $activePriceTicker))
        }

        // Push tokens in as received by the balance provider
        records.push(...$balancesProvider.tokens)

        set(records)
    },
    initialTokens
)

export function makeTokenKey(token: TokenKeyParams): string {
    return [String(token.chainId), String(token.contract), String(token.name)]
        .join('-')
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
