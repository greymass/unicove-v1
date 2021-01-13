import Link, {ChainId, PermissionLevel} from 'anchor-link'
import Transport from 'anchor-link-browser-transport'
import {get} from 'svelte/store'

import {storeAccount} from './account-cache'
import {getClient} from './api-client'
import {appId, chains, chainConfig} from './config'
import {activeBlockchain, activeSession, availableSessions} from './store'

const transport = new Transport()
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
    const session = await link.restoreSession(appId)
    const list = await link.listSessions(appId)
    availableSessions.set(list)
    if (session) {
        activeBlockchain.set(chainConfig(session.chainId))
        activeSession.set(session)
    }
}

/** Create a new session. */
export async function login() {
    const result = await link.login(appId)
    // populate account cache with the account returned by login so we don't need to re-fetch it
    storeAccount(result.account, result.session.chainId)
    const list = await link.listSessions(appId)
    activeBlockchain.set(chainConfig(result.session.chainId))
    activeSession.set(result.session)
    availableSessions.set(list)
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
                activeSession.set(null)
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
    activeBlockchain.set(chainConfig(session.chainId))
    activeSession.set(session)
}
