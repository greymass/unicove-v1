import type {API, LinkSession} from 'anchor-link'
import {derived, writable} from 'svelte/store'
import {loadAccount} from './account-cache'
import type {SessionLike} from './auth'
import {chains} from './config'
import type {ChainConfig} from './config'
import {Preferences} from './preferences'

/** Set to true when app initialization completes. */
export const appReady = writable<boolean>(false)

/** Configuration of the currently selected blockchain */
export const activeBlockchain = writable<ChainConfig>(chains[0])

/** Active anchor link session, aka logged in user. */
export const activeSession = writable<LinkSession | null>(null)

/** List of all available anchor link sessions. */
export const availableSessions = writable<SessionLike[]>([])

/** List of preferences. */
export const preferences = Preferences.shared

/** Current logged in users account. */
export const currentAccount = derived<typeof activeSession, API.v1.AccountObject | null>(
    activeSession,
    (session, set) => {
        if (!session) {
            set(null)
            return
        }
        let active = true
        loadAccount(session.auth.actor, session.chainId, (v) => {
            if (active) {
                set(v.account || null)
            }
        })
        return () => {
            active = false
        }
    },
    null
)
