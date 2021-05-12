import type {AccountName, ChainId, LinkSession, Name} from 'anchor-link'
import type {Asset} from 'anchor-link'
import {derived} from 'svelte/store'
import type {Readable} from 'svelte/store'

import {activeSession, currentAccount} from '~/store'
import {createTokenFromChainId, makeTokenKey, Token} from '~/stores/tokens'
import {balancesProvider, updateBalances} from '~/stores/balances-provider'
import {updateAccount} from './account-provider'

export interface Balance {
    key: string
    chainId: ChainId
    account: Name
    tokenKey: string
    quantity: Asset
}

const initialBalances: Balance[] = []

export const balances: Readable<Balance[]> = derived(
    [activeSession, balancesProvider, currentAccount],
    ([$activeSession, $balancesProvider, $currentAccount], set) => {
        const records = []
        // Push any core balance information in from the current account
        if ($activeSession && $currentAccount && $currentAccount.core_liquid_balance) {
            records.push(
                createBalanceFromCoreToken($activeSession, $currentAccount.core_liquid_balance)
            )
        }
        // Push balances in as received by the balance provider
        records.push(...$balancesProvider.balances)
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
