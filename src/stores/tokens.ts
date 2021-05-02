import type {Asset} from 'anchor-link'
import type {ChainId, NameType} from 'anchor-link'
import {derived, get} from 'svelte/store'
import type {Readable} from 'svelte/store'

import {chainConfig} from '~/config'
import {activePriceTicker, activeSession} from '~/store'
import {balancesProvider} from './balancesProvider'

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
