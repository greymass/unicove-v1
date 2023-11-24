import {Link, ChainId, LinkSession, PermissionLevel} from 'anchor-link'
import Transport from 'anchor-link-browser-transport'
import {get} from 'svelte/store'

import {storeAccount} from './stores/account-provider'
import {getClient} from './api-client'
import {appId, chains} from './config'
import {activeEvmSession, activeSession, availableSessions} from './store'
import {startEvmSession} from './lib/evm'
import {fetchBalances} from './stores/balances'

const transport = new Transport({
    requestStatus: false,
})
const link = new Link({
    chains: chains.map((chain) => ({chainId: chain.chainId, nodeUrl: getClient(chain)})),
    transport,
})

/** Anchor Link session object or identifier. */
export interface SessionLike {
    auth: PermissionLevel
    chainId: ChainId
}

/** Compare two session-ish objects. */
export function sessionEquals(a: SessionLike, b: SessionLike) {
    return a.auth.equals(b.auth) && a.chainId.equals(b.chainId)
}

/** Restore previous sessions. */
export async function init() {
    const list = await link.listSessions(appId)
    let session: LinkSession | null = null
    if (window.location.search.includes('auth=')) {
        // load active session from query string if present
        // prompt for login if an auth is requested but not available
        const qs = new URLSearchParams(window.location.search)
        const auth = PermissionLevel.from(qs.get('auth') || '')
        let chainId: ChainId | undefined
        if (qs.has('chain')) {
            chainId = ChainId.from(qs.get('chain') || '')
        }
        session = await link.restoreSession(appId, auth, chainId)
        const removeQuery = () => {
            if (window.history) {
                window.history.replaceState(null, '', window.location.pathname)
            }
        }
        if (!session) {
            return login().finally(removeQuery) // keep qs until after login so anchor redirects back correctly
        } else {
            removeQuery()
        }
    } else {
        session = await link.restoreSession(appId)
    }
    availableSessions.set(list)
    if (session) {
        activeSession.set(session)
    }
}

/** Create a new session. */
export async function login() {
    const result = await link.login(appId)
    if (result.account) {
        // populate account cache with the account returned by login so we don't need to re-fetch it
        storeAccount(result.account, result.session.chainId)
    }
    const list = await link.listSessions(appId)
    availableSessions.set(list)
    activeSession.set(result.session)
}

/** Remove existing session. */
export async function logout(id: SessionLike) {
    const session = await link.restoreSession(appId, id.auth, id.chainId)
    if (session) {
        await session.remove()
        const list = await link.listSessions(appId)
        let active = get(activeSession)
        if (active && sessionEquals(active, session)) {
            // update active session if we logged out from it
            if (list.length > 0) {
                activate(list[0])
            } else {
                activeSession.set(undefined)
            }
        }
        availableSessions.set(list)
    }
}

/** Set active session. */
export async function activate(id: SessionLike) {
    const session = await link.restoreSession(appId, id.auth, id.chainId)
    if (!session) {
        throw new Error('No such session')
    }
    activeSession.set(session)

    if (get(activeEvmSession)) {
        activeEvmSession.set(undefined)
        await startEvmSession()
        fetchBalances(get(activeSession), true)
    }
}
