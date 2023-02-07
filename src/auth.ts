import {Checksum256, PermissionLevel} from '@greymass/eosio'
import {get} from 'svelte/store'

import {storeAccount} from './stores/account-provider'
import {getClient} from './api-client'
import {appId, chains} from './config'
import {activeSession, availableSessions} from './store'
import {Session, SessionKit} from '@wharfkit/session'
import app from './main'
import WebUIRenderer from '@wharfkit/web-ui-renderer'
import {WalletPluginPrivateKey} from '@wharfkit/wallet-plugin-privatekey'
import {WalletPluginAnchor} from '@wharfkit/wallet-plugin-anchor'
import {WalletPluginWAX} from '@wharfkit/wallet-plugin-wax'

const sessionKit = new SessionKit({
    appName: 'unicove.gm',
    chains: chains.map((chain) => {
        return {
            id: String(chain.chainId),
            url: chain.nodeUrl,
        }
    }),
    ui: new WebUIRenderer(),
    walletPlugins: [
        new WalletPluginAnchor(),
        new WalletPluginWAX(),
        new WalletPluginPrivateKey({
            privateKey: '5KjRJdfnE22B5jSmXo2oat5NuJK8DUYQmJumpYuX2tnXYNSdr9f',
        }),
        new WalletPluginPrivateKey({
            privateKey: '5KAdimGJQ8rNdA5tnx84ZjxU4v6ndzSCMTwqQn7ufigYiBauxrK',
        }),
    ],
})

/** Anchor Link session object or identifier. */
export interface SessionLike {
    auth: PermissionLevel
    chainId: Checksum256
}

/** Compare two session-ish objects. */
export function sessionEquals(a: SessionLike, b: SessionLike) {
    return a.auth.equals(b.auth) && a.chainId.equals(b.chainId)
}

/** Restore previous sessions. */
export async function init() {
    // TODO: List all existing sessions
    // OLD CODE...
    // const list = await link.listSessions(appId)
    const list: SessionLike[] = []

    let session: Session | null = null
    if (window.location.search.includes('auth=')) {
        // load active session from query string if present
        // prompt for login if an auth is requested but not available
        const qs = new URLSearchParams(window.location.search)
        const auth = PermissionLevel.from(qs.get('auth') || '')
        let chainId: Checksum256
        if (qs.has('chain')) {
            chainId = Checksum256.from(qs.get('chain') || '')
        }
        // TODO: Restore session found in URL
        // OLD CODE...
        // session = await link.restoreSession(appId, auth, chainId)
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
        // TODO: Restore session based on appId
        // OLD CODE...
        // session = await link.restoreSession(appId)
    }
    availableSessions.set(list)
    if (session) {
        activeSession.set(session)
    }
}

/** Create a new session. */
export async function login() {
    const result = await sessionKit.login({
        permissionLevel: 'test.gm@active',
    })

    // TODO: Reimplement when account kit is part of the Session
    // if (result.account) {
    //     // populate account cache with the account returned by login so we don't need to re-fetch it
    //     storeAccount(result.account, result.session.chainId)
    // }

    // TODO: Reimplement when the session kit has an array of available sessions to return
    // const list = await link.listSessions(appId)
    // availableSessions.set(list)

    activeSession.set(result.session)
}

/** Remove existing session. */
export async function logout(id: SessionLike) {
    // TODO: Restore session based on appId
    // OLD CODE...
    // const session = await link.restoreSession(appId, id.auth, id.chainId)
    let session: Session | null = null

    if (session) {
        // TODO: Reimplement when session kit storage has a removal method
        // await session.remove()

        // TODO: Reimplement when the session kit has an array of available sessions to return
        // const list = await link.listSessions(appId)
        const list: SessionLike[] = []

        let active = get(activeSession)
        // if (active && sessionEquals(active, session)) {
        //     // update active session if we logged out from it
        //     if (list.length > 0) {
        //         activate(list[0])
        //     } else {
        //         activeSession.set(undefined)
        //     }
        // }
        availableSessions.set(list)
    }
}

/** Set active session. */
export async function activate(id: SessionLike) {
    // TODO: Restore session based on appId
    // OLD CODE...
    // const session = await link.restoreSession(appId, id.auth, id.chainId)
    // if (!session) {
    //     throw new Error('No such session')
    // }
    // activeSession.set(session)
    console.log('activate account', id)
}
