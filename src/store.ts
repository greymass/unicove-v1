import type {LinkSession} from 'anchor-link'
import {derived, writable} from 'svelte/store'
import type {Readable} from 'svelte/store'
import type {SessionLike} from './auth'
import {ChainConfig, chainConfig, chains} from './config'
import {Preferences} from './preferences'
import {priceTicker} from './price-ticker'

/** Set to true when app initialization completes. */
export const appReady = writable<boolean>(false)

/** Active anchor link session, aka logged in user. */
export const activeSession = writable<LinkSession | undefined>(undefined)

/** Configuration of the currently selected blockchain */
export const activeBlockchain: Readable<ChainConfig> = derived(activeSession, (session) => {
    if (session) {
        return chainConfig(session.chainId)
    } else {
        return chains[0]
    }
})

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
