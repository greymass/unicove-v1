import type {Checksum256, Name} from '@wharfkit/antelope'
import {Asset} from '@wharfkit/antelope'
import {derived} from 'svelte/store'
import type {Readable} from 'svelte/store'

import {activeBlockchain, activeSession, currentAccount} from '~/store'
import {createTokenFromChainId, makeTokenKey, Token} from '~/stores/tokens'
import {balancesProvider, updateBalances} from '~/stores/balances-provider'
import {updateAccount} from './account-provider'
import type {Session} from '@wharfkit/session'

export interface Balance {
    key: string
    chainId: Checksum256
    account: Name
    tokenKey: string
    quantity: Asset
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

export function makeBalanceKey(token: Token, account: Name): string {
    return [
        String(token.chainId),
        String(token.contract),
        String(token.symbol.name),
        String(account),
    ]
        .join('-')
        .toLowerCase()
}

export function createBalanceFromCoreToken(session: Session, balance: Asset): Balance {
    const token = createTokenFromChainId(session.chain.id)
    return createBalanceFromToken(session, token, balance)
}

export function createBalanceFromToken(session: Session, token: Token, balance: Asset): Balance {
    const key = makeBalanceKey(token, session.actor)
    const record: Balance = {
        key,
        chainId: session.chain.id,
        account: session.actor,
        tokenKey: makeTokenKey(token),
        quantity: balance,
    }
    return record
}

export async function fetchBalances(session: Session | undefined, refresh = false) {
    if (session) {
        // Refresh the sessions account data
        updateAccount(session.actor, session.chain.id, refresh)
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
