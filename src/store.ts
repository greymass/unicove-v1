import type {API, LinkSession} from 'anchor-link'
import {Asset, UInt64} from 'anchor-link'
import {derived, writable} from 'svelte/store'
import {loadAccount} from './account-cache'
import type {SessionLike} from './auth'
import {chainConfig, chains} from './config'
import {Preferences} from './preferences'
import {wait} from '~/helpers'

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
    async (session, set) => {
            const account = await fetchAccount(session)
            console.log({account})
            if (!account.core_liquid_balance) {
                const assets = await fetchBalance(session)


                console.log({assets})
                account.core_liquid_balance = assets[0]
            }

            set(account)
        },
    undefined
)

export const txFee = derived<typeof activeSession, API.v1.AccountObject | undefined>(
    activeSession,
    async (session, set) => {
        let ableToFetch = true
        while (ableToFetch) {
            const account = await fetchAccount(session)
            const blockchain = await fetchActiveBlockchain(session)

            const fee = await fetchFee(account, blockchain).catch(error => {
                ableToFetch = false
            })

            set(fee)

            await wait(15000)
        }

    },
    undefined
)

export function fetchActiveBlockchain() {
    return new Promise(resolve => {
        activeBlockchain.subscribe(chainData => {
            resolve(chainData)
        })
    })
}

function fetchAccount(session) {
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

async function fetchFee(session, blockchain) {
    const fees = await session.client.v1.chain.get_table_rows({
        code: "fio.fee",
        table: "fiofees",
        scope: "fio.fee",
        key_type: "i64",
        index_position: "primary",
        lower_bound: UInt64.from(5),
        upper_bound: UInt64.from(5),
        limit: 1
    });

    return Asset.fromUnits(fees.rows[0].suf_amount, blockchain.coreTokenSymbol);
}
