import type {Asset, API, LinkSession} from 'anchor-link'
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

/** List of preferences. */
export const preferences = Preferences.shared

/** Current logged in users account. */
export const currentAccount = derived<typeof activeSession, API.v1.AccountObject | undefined>(
    activeSession,
    (session: LinkSession | undefined, set: (v: API.v1.AccountObject | undefined) => void) => {
        if (!session) {
            set(undefined)
            return
        }

        let active = true

        loadAccount(session.auth.actor, session.chainId, async (v) => {
            if (!active) {
                return
            }
            const account = v.account

            if (!account?.core_liquid_balance) {
                const assets: Asset[] | void = await fetchBalance(session!).catch((err) => {
                    console.log('Error fetching account balance:', err)
                })

                if (assets) {
                    account!.core_liquid_balance = assets[0]!
                }
            }
            set(account)
        })

        return () => {
            active = false
        }
    },
    undefined
)

export function fetchActiveAccount(
    session: LinkSession
): Promise<API.v1.AccountObject | undefined> {
    return new Promise((resolve) => {
        loadAccount(session.auth.actor, session.chainId, (v) => {
            resolve(v.account || undefined)
        })
    })
}

function fetchBalance(session: LinkSession) {
    return session.client.v1.chain.get_currency_balance(
        chainConfig(session.chainId).coreTokenContract,
        session.auth.actor
    )
}
