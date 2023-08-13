import {get, writable} from 'svelte/store'
import type {Writable} from 'svelte/store'

import {chainConfig} from '~/config'
import {activeSession} from '~/store'
import {getBalanceProvider} from '~/lib/balance-providers/utils'
import {Balance} from './balances'
import {Session} from '@wharfkit/session'

export const isLoading: Writable<boolean> = writable(false)

interface BalancesProvider {
    balances: Balance[]
}

const initialBalances: BalancesProvider = {
    balances: [],
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

export async function updateBalances(session: Session) {
    isLoading.set(true)
    const chain = chainConfig(session.chain.id)
    if (chain.balanceProviders) {
        for (const p of chain.balanceProviders) {
            const provider = getBalanceProvider(p, chain)
            if (provider) {
                const balances = await provider.fetchBalances(session.actor)
                balancesProvider.set({
                    balances: balances,
                })
                break
            }
        }
    }
    isLoading.set(false)
}
