import {Asset, LinkSession, Name} from 'anchor-link'
import {get, writable} from 'svelte/store'
import type {Writable} from 'svelte/store'

import {chainConfig} from '~/config'
import {activeEvmSession, activeSession, evmBalance, waitForStoreValue} from '~/store'
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
                // Fetch evm balances when applicable
                const evmSession = await waitForStoreValue(activeEvmSession)
                if (evmSession) {
                    const evmBalances = await evmSession.getBalances()

                    evmBalances.forEach((balance) => {
                        const tokenKey = `evm-${String(balance.symbol.code).toLowerCase()}`
                        balances.push({
                            key: tokenKey,
                            chainId: session.chainId,
                            account: Name.from('eosio.evm'),
                            tokenKey,
                            quantity: balance,
                        })
                    })
                }
                console.log({ balances })
                balancesProvider.set({
                    balances: balances,
                })
                break
            }
        }
    }
    isLoading.set(false)
}

export async function updateEvmBalance() {
    const evmSession = await waitForStoreValue(activeEvmSession)

    if (evmSession) {
        const balance = await evmSession.getBalance()
        evmBalance.set(Asset.from(balance))
    }
}
