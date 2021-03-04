import type {API, LinkSession} from 'anchor-link'
import {Asset, UInt64} from 'anchor-link'
import {derived, writable} from 'svelte/store'
import {loadAccount} from './account-cache'
import type {SessionLike} from './auth'
import {chainConfig, chains} from './config'
import {Preferences} from './preferences'

/** Set to true when app initialization completes. */
export const appReady = writable<boolean>(false)

/** Active anchor link session, aka logged in user. */
export const activeSession = writable<LinkSession | undefined>(undefined)

/** Configuration of the currently selected blockchain */
export const activeBlockchain = derived(activeSession, (session) => {
    if (session) {
        return chainConfig(session.chainId)
    } else {
        return chains[0]
    }
})

/** List of all available anchor link sessions. */
export const availableSessions = writable<SessionLike[]>([])

/** List of txFees by chain. */
export const txFees = writable<Object>({})

export const currentTxFees = derived<typeof txFees, Asset | undefined>(
    txFees,
    async (txFeesData, set) => {
        const activeBlockchain = await fetchActiveBlockchain()

        set(txFeesData[activeBlockchain.id])
    }
)

/** List of preferences. */
export const preferences = Preferences.shared

/** Current logged in users account. */
export const currentAccount = derived<typeof activeSession, API.v1.AccountObject | undefined>(
    activeSession,
    async (session, set) => {
            const account = await fetchActiveAccount(session)
            if (!account.core_liquid_balance) {
                const assets = await fetchBalance(session)

                account.core_liquid_balance = assets[0]
            }

            set(account)
        },
    undefined
)

export function fetchActiveSession() {
    return new Promise(resolve => {
        activeSession.subscribe(sessionData => {
            resolve(sessionData)
        })
    })
}

export function fetchActiveBlockchain() {
    return new Promise(resolve => {
        activeBlockchain.subscribe(chainData => {
            resolve(chainData)
        })
    })
}

export function fetchActiveAccount(session) {
    return new Promise(resolve => {
        loadAccount(session.auth.actor, session.chainId, (v) => {
            resolve(v.account || undefined)
        })
    })
}

function fetchBalance(session) {
    return session.client.v1.chain.get_currency_balance(
        chainConfig(session.chainId).coreTokenContract,
        session.auth.actor
    );
}
