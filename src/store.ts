import type {Asset, LinkSession} from 'anchor-link'
import {derived, writable} from 'svelte/store'
import type {Readable} from 'svelte/store'
import type {SessionLike} from './auth'
import {ChainConfig, chainConfig, chains} from './config'
import {Preferences} from './preferences'
import {priceTicker} from './price-ticker'
import {accountProvider} from './stores/account-provider'
import type {EvmSession} from './lib/evm'

/** Set to true when app initialization completes. */
export const appReady = writable<boolean>(false)

/** Active anchor link session, aka logged in user. */
export const activeSession = writable<LinkSession | undefined>(undefined)

/** Active EVM account, aka logged in user. */
export const activeEvmSession = writable<EvmSession | undefined>(undefined)

/** Configuration of the currently selected blockchain */
export const activeBlockchain: Readable<ChainConfig> = derived(activeSession, (session) => {
    if (session) {
        return chainConfig(session.chainId)
    } else {
        return chains[0]
    }
})

export function getActiveBlockchain(): Promise<ChainConfig> {
    let unsubscribe: () => void
    return new Promise((resolve) => {
        unsubscribe = activeBlockchain.subscribe((chain) => {
            if (chain) {
                unsubscribe && unsubscribe()
                resolve(chain)
            }
        })
    })
}

/** Active price ticker for the currently selected blockchain */
export const activePriceTicker: Readable<number> = derived(
    [activeBlockchain],
    ([$activeBlockchain], set) =>
        priceTicker($activeBlockchain).value.subscribe((v) => {
            if (v !== undefined) {
                set(v)
            }
        })
)

/** List of all available anchor link sessions. */
export const availableSessions = writable<SessionLike[]>([])

/** List of preferences. */
export const preferences = Preferences.shared

/** Current logged in users account data. */
export const currentAccount = derived(
    accountProvider,
    ($accountProvider) => $accountProvider.account
)

/** Current system token balance of current logged in user. */
export const currentAccountBalance: Readable<Asset | undefined> = derived(
    currentAccount,
    ($currentAccount) => {
        if ($currentAccount) {
            return $currentAccount.core_liquid_balance
        }
    }
)

const systemDarkMode = writable<boolean>(
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
)
if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
        systemDarkMode.set(event.matches)
    })
}

/** If dark mode is enabled. */
export const darkMode = derived(
    [systemDarkMode, preferences],
    ([$systemDarkMode, $preferences]) => {
        if ($preferences.darkmode !== null) {
            return $preferences.darkmode
        } else {
            return $systemDarkMode
        }
    }
)

export function getActiveSession(): Promise<LinkSession> {
    let unsubscribe: () => void | undefined
    return new Promise((resolve) => {
        unsubscribe = activeSession.subscribe((session) => {
            if (session) {
                unsubscribe && unsubscribe()
                resolve(session)
            }
        })
    })
}

export function getActiveEvmSession(): Promise<EvmSession> {
    let unsubscribe: () => void | undefined
    return new Promise((resolve) => {
        unsubscribe = activeEvmSession.subscribe((session) => {
            if (session) {
                unsubscribe && unsubscribe()
                resolve(session)
            }
        })
    })
}
