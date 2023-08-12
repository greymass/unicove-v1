import {Checksum256, Name, PermissionLevel} from '@wharfkit/antelope'
import {get} from 'svelte/store'

import {storeAccount} from './stores/account-provider'
import {chains} from './config'
import {activeSession, availableSessions} from './store'
import {ChainDefinition, SerializedSession, Session, SessionKit} from '@wharfkit/session'
import WebUIRenderer from '@wharfkit/web-renderer'
import {TransactPluginResourceProvider} from '@wharfkit/transact-plugin-resource-provider'
import {WalletPluginAnchor} from '@wharfkit/wallet-plugin-anchor'

const sessionKit = new SessionKit(
    {
        appName: 'unicove.gm',
        chains: chains.map((chain) =>
            ChainDefinition.from({
                id: String(chain.chainId),
                url: chain.nodeUrl,
            })
        ),
        ui: new WebUIRenderer(),
        walletPlugins: [new WalletPluginAnchor()],
    },
    {
        transactPlugins: [new TransactPluginResourceProvider()],
    }
)

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
        let restoreArgs = undefined
        const auth = PermissionLevel.from(qs.get('auth') || '')
        if (auth) {
            let chainId: Checksum256 | undefined
            if (qs.has('chain')) {
                chainId = Checksum256.from(qs.get('chain') || '')
                restoreArgs = {
                    actor: auth.actor,
                    permission: auth.permission,
                    chain: chainId,
                }
            }
        }
        session = await sessionKit.restore(restoreArgs)
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

    // TODO: Utilize Account Kit data returned from Session once available
    if (result.session) {
        const accountData = await result.session.client.v1.chain.get_account(result.session.actor)
        storeAccount(accountData, result.session.chain.id)
    }

    const list = await sessionKit.getSessions()
    availableSessions.set(list)

    activeSession.set(result.session)
}

/** Remove existing session. */
export async function logout(id: SerializedSession) {
    // Logout based on ID provided
    await sessionKit.logout(id)

    // Get the value of the currently active session
    const active = get(activeSession)

    // Refresh available Sessions from kit
    const list: SerializedSession[] = await sessionKit.getSessions()

    // If the logged out session was the current session, activate another session automatically
    if (active && sessionEquals(active.serialize(), id)) {
        if (list.length > 0) {
            activate(list[0])
        } else {
            activeSession.set(undefined)
        }
    }

    availableSessions.set(list)
}

/** Set active session. */
export async function activate(id: SerializedSession) {
    const session = await sessionKit.restore(id)
    if (!session) {
        throw new Error('No such session')
    }
    activeSession.set(session)
}
