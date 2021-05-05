import type {Asset, LinkSession} from 'anchor-link'
import {derived, writable} from 'svelte/store'
import type {Readable} from 'svelte/store'
import type {SessionLike} from './auth'
import {ChainConfig, chainConfig} from './config'
import {Preferences} from './preferences'
import {priceTicker} from './price-ticker'
import {accountProvider} from './stores/account-provider'

/** Set to true when app initialization completes. */
export const appReady = writable<boolean>(false)

/** Active anchor link session, aka logged in user. */
export const activeSession = writable<LinkSession | undefined>(undefined)

/** Configuration of the currently selected blockchain */
export const activeBlockchain: Readable<ChainConfig> = derived(activeSession, (session) =>
    chainConfig(session!.chainId)
)

/** Active price ticker for the currently selected blockchain */
export const activePriceTicker: Readable<number> = derived(
    [activeBlockchain],
    ([$activeBlockchain], set) =>
        priceTicker($activeBlockchain).value.subscribe((v) => {
            if (v) {
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
