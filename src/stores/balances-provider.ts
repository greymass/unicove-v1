import type {LinkSession} from 'anchor-link'
import {get, writable} from 'svelte/store'
import type {Writable} from 'svelte/store'

import {chainConfig} from '~/config'
import {activeSession} from '~/store'
import type {Balance} from '~/stores/balances'
import {getBalanceProvider} from '~/lib/balance-providers/utils'

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

export async function updateBalances(session: LinkSession) {
    isLoading.set(true)
    const chain = chainConfig(session.chainId)
    if (chain.balanceProviders) {
        for (const p of chain.balanceProviders) {
            const provider = getBalanceProvider(p, chain)
            if (provider) {
                const balances = await provider.fetchBalances(session.auth.actor)
                balancesProvider.set({
                    balances: balances,
                })
                break
            }
        }
    }
    isLoading.set(false)
}
