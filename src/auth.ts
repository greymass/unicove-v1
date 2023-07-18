import {Checksum256, Name, PermissionLevel} from '@greymass/eosio'
import {get} from 'svelte/store'

import {storeAccount} from './stores/account-provider'
import {getClient} from './api-client'
import {appId, chains} from './config'
import {activeSession, availableSessions} from './store'
import {BrowserLocalStorage, SerializedSession, Session, SessionKit} from '@wharfkit/session'
import app from './main'
import WebUIRenderer from '@wharfkit/web-renderer'
import {WalletPluginPrivateKey} from '@wharfkit/wallet-plugin-privatekey'
import {TransactPluginResourceProvider} from '@wharfkit/transact-plugin-resource-provider'
import {WalletPluginAnchor} from '@wharfkit/wallet-plugin-anchor'
import {WalletPluginMock} from '@wharfkit/wallet-plugin-mock'
import {TransactPluginAutoCorrect} from '@wharfkit/transact-plugin-autocorrect'
import {WalletPluginCloudWallet} from '@wharfkit/wallet-plugin-cloudwallet'

const sessionKit = new SessionKit({
    appName: 'unicove.gm',
    chains: chains.map((chain) => {
        return {
            id: String(chain.chainId),
            url: chain.nodeUrl,
        }
    }),
    transactPlugins: [new TransactPluginResourceProvider()],
    ui: new WebUIRenderer(),
    walletPlugins: [
        new WalletPluginAnchor(),
        // new WalletPluginMock(),
        // new WalletPluginWAX(),
        // new WalletPluginPrivateKey('5Jtoxgny5tT7NiNFp1MLogviuPJ9NniWjnU4wKzaX4t7pL4kJ8s'),
    ],
})

/** Compare two session-ish objects. */
export function sessionEquals(a: SerializedSession, b: SerializedSession) {
    return (
        Name.from(a.actor).equals(Name.from(b.actor)) &&
        Name.from(a.permission).equals(Name.from(b.permission)) &&
        Checksum256.from(a.chain).equals(Checksum256.from(b.chain))
    )
}

/** Restore previous sessions. */
export async function init() {
    const list: SerializedSession[] = await sessionKit.getSessions()

    let session: Session | undefined
    if (window.location.search.includes('auth=')) {
        // load active session from query string if present
        // prompt for login if an auth is requested but not available
        // https://unicove.com/?auth=jesta.game@active&chain=aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906
        const qs = new URLSearchParams(window.location.search)
        const auth = PermissionLevel.from(qs.get('auth') || '')
        let chainId: Checksum256
        if (qs.has('chain')) {
            chainId = Checksum256.from(qs.get('chain') || '')
        }
        // TODO: Restore session found in URL
        // OLD CODE...
        session = await sessionKit.restore({
            actor: auth.actor,
            permission: auth.permission,
            chain: chainId,
        })
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
        const sessions = await sessionKit.getSessions()
        if (sessions.length) {
            session = await sessionKit.restore()
        }
    }
    availableSessions.set(list)
    if (session) {
        activeSession.set(session)
    }
}

/** Create a new session. */
export async function login() {
    const result = await sessionKit.login()

    // TODO: Reimplement when account kit is part of the Session
    // if (result.account) {
    //     // populate account cache with the account returned by login so we don't need to re-fetch it
    //     storeAccount(result.account, result.session.chainId)
    // }

    const list = await sessionKit.getSessions()
    availableSessions.set(list)

    activeSession.set(result.session)
}

/** Remove existing session. */
export async function logout(id: SerializedSession) {
    // TODO: Restore session based on appId
    // OLD CODE...
    const session = await sessionKit.restore(id)
    // let session: Session | null = null

    if (session) {
        // TODO: Reimplement when session kit storage has a removal method
        await sessionKit.logout(session)

        // TODO: Reimplement when the session kit has an array of available sessions to return
        // const list = await link.listSessions(appId)
        const list: SerializedSession[] = await sessionKit.getSessions()

        let active = get(activeSession)
        console.log(active)
        if (active && sessionEquals(active.serialize(), session.serialize())) {
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
export async function activate(id: SerializedSession) {
    // TODO: Restore session based on appId
    // OLD CODE...
    console.log(id)
    const session = await sessionKit.restore(id)
    // const session = await link.restoreSession(appId, id.auth, id.chainId)
    if (!session) {
        throw new Error('No such session')
    }
    activeSession.set(session)
    console.log('activate account', id)
}
