import type {API, AccountName, ChainId, LinkSession} from 'anchor-link'
import {Asset, Name} from 'anchor-link'
import {derived} from 'svelte/store'
import type {Readable} from 'svelte/store'

import {activeBlockchain, activeSession, currentAccount} from '~/store'
import {createTokenFromChainId, makeTokenKey, Token} from '~/stores/tokens'
import {balancesProvider, updateBalances} from '~/stores/balances-provider'
import {updateAccount} from './account-provider'
import {chainConfig} from '~/config'

export interface Balance {
    key: string
    chainId: ChainId
    account: Name
    tokenKey: string
    quantity: Asset
    contract: Name
}

const initialBalances: Balance[] = []

export const balances: Readable<Balance[]> = derived(
    [activeSession, activeBlockchain, balancesProvider, currentAccount],
    ([$activeSession, $activeBlockchain, $balancesProvider, $currentAccount], set) => {
        const records = []

        // Push any core balance information in from the current account
        if ($activeSession && $currentAccount) {
            let coreBalance = $currentAccount.core_liquid_balance
            if (!coreBalance) {
                coreBalance = Asset.from(0, $activeBlockchain.coreTokenSymbol)
            }
            records.push(createBalanceFromCoreToken($activeSession, coreBalance))
            const {total, available} = createBalancesFromRam($activeSession, $currentAccount)
            records.push(total)
            records.push(available)
        }

        let newBalances = $balancesProvider.balances
        if ($activeSession) {
            const coreToken = createTokenFromChainId($activeSession.chainId)
            newBalances = newBalances.filter((x) => x.tokenKey !== coreToken.key)
        }
        // Push balances in as received by the balance provider
        records.push(...newBalances)

        set(records)
    },
    initialBalances
)

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

export function createBalanceFromCoreToken(session: LinkSession, balance: Asset): Balance {
    const token = createTokenFromChainId(session.chainId)
    return createBalanceFromToken(session, token, balance)
}

export function createBalancesFromRam(
    session: LinkSession,
    account: API.v1.AccountObject
): {
    total: Balance
    available: Balance
} {
    const {chainId} = session
    const chain = chainConfig(chainId)
    const symbol = Asset.Symbol.from('4,RAMKB')
    const usedToken = {
        chainId,
        contract: 'eosio',
        action: 'ramtransfer',
        symbol,
        name: 'ram-kb-used',
        logo: `https://www.bloks.io/img/chains/${chain.coreTokenSymbol.name.toLowerCase()}.png`,
        key: `${chainId}-eosio-${symbol}-ramused`,
    }
    const usedBalance = Asset.fromUnits(account.ram_usage, '3,RAMKB')
    const availableToken = {
        chainId,
        contract: 'eosio',
        action: 'ramtransfer',
        symbol,
        name: 'ram-kb-available',
        logo: `https://www.bloks.io/img/chains/${chain.coreTokenSymbol.name.toLowerCase()}.png`,
        key: `${chainId}-eosio-${symbol}-ramavailable`,
    }
    const availableBalance = Asset.fromUnits(
        account.ram_quota.subtracting(account.ram_usage),
        '3,RAMKB'
    )
    return {
        total: createBalanceFromToken(session, usedToken, usedBalance),
        available: createBalanceFromToken(session, availableToken, availableBalance),
    }
}

export function createBalanceFromToken(
    session: LinkSession,
    token: Token,
    balance: Asset
): Balance {
    const key = makeBalanceKey(token, session.auth.actor)
    const record: Balance = {
        key,
        chainId: session.chainId,
        account: session.auth.actor,
        tokenKey: makeTokenKey(token),
        quantity: balance,
        contract: Name.from(token.contract),
    }
    return record
}

export async function fetchBalances(session: LinkSession | undefined, refresh = false) {
    if (session) {
        // Refresh the sessions account data
        updateAccount(session.auth.actor, session.chainId, refresh)
        // Refresh balances from the balance provider
        updateBalances(session)
    }
}

export const systemTokenBalance: Readable<Balance | undefined> = derived(
    [activeBlockchain, balances],
    ([$activeBlockchain, $balances]) => {
        if ($activeBlockchain) {
            const token = createTokenFromChainId($activeBlockchain.chainId)

            return $balances.find((b) => b.tokenKey === token.key)
        }
    }
)
