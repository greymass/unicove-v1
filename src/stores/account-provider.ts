import {API, Asset, Name, Serializer} from '@wharfkit/antelope'
import type {Checksum256, NameType} from '@wharfkit/antelope'
import {get, writable} from 'svelte/store'
import type {Readable, Writable} from 'svelte/store'

import {getClient} from '~/api-client'
import {dbPromise} from '~/db'
import {activeSession} from '~/store'
import {chainConfig} from '~/config'

/** How old a cached account is before we update it */
const maxAge = 60 * 1000 // ms

export const isLoading: Writable<boolean> = writable(false)

const initialAccountResponse: AccountResponse = {
    stale: true,
}

export const accountProvider: Writable<AccountResponse> = writable(initialAccountResponse, () => {
    // Update on a set interval
    const interval = setInterval(() => {
        const session = get(activeSession)
        if (session) {
            updateAccount(session.actor, session.chain.id)
        }
    }, 30000)

    // Subscribe to changes to the active session and update on change
    const unsubscribe = activeSession.subscribe((session) => {
        if (session) {
            updateAccount(session.actor, session.chain.id)
        }
    })

    return () => {
        unsubscribe()
        clearInterval(interval)
    }
})

export async function updateAccount(name: Name, chainId: Checksum256, refresh: boolean = false) {
    isLoading.set(true)
    loadAccount(
        name,
        chainId,
        async (v) => {
            if (!v.account?.core_liquid_balance) {
                const assets: Asset[] | void = await fetchBalance(name, chainId).catch((err) => {
                    console.warn('Error fetching account balance:', err)
                })
                if (assets) {
                    v.account!.core_liquid_balance = assets[0]!
                }
            }
            accountProvider.set(v)
        },
        refresh
    )
    isLoading.set(false)
}

function fetchBalance(name: Name, chainId: Checksum256) {
    const chain = chainConfig(chainId)
    return getClient(chainId).v1.chain.get_currency_balance(chain.coreTokenContract, name)
}

export interface AccountResponse {
    /** The account object for the requested account. */
    account?: API.v1.AccountObject
    /** Whether the account is being updated in the background.  */
    stale: boolean
    /** Set if an error occurred while fetching the account. */
    error?: Error
}

function accountKey(name: Name, chainId: Checksum256) {
    return `${chainId}-${name}`
}

export async function storeAccount(account: API.v1.AccountObject, chainId: Checksum256) {
    const db = await dbPromise
    await db.put(
        'account-cache',
        {
            account: Serializer.objectify(account),
            updated: new Date(),
        },
        accountKey(account.account_name, chainId)
    )
}

export async function loadAccount(
    name: Name,
    chainId: Checksum256,
    set: (v: AccountResponse) => void,
    refresh = false
) {
    const key = accountKey(name, chainId)
    let db = await dbPromise
    let row = await db.get('account-cache', key)
    let stale = true
    if (row) {
        const age = Date.now() - row.updated.getTime()
        stale = age > maxAge
        set({account: API.v1.AccountObject.from(row.account), stale})
    }
    if (stale || refresh) {
        const account = await getClient(chainId).v1.chain.get_account(name)
        await storeAccount(account, chainId)
        set({account: account, stale: false})
    }
}

/** Get an account, can be used to fetch other accounts than the logged in users. */
export function getAccount(
    name: NameType,
    chainId: Checksum256,
    refresh = false
): Readable<AccountResponse> {
    const store = writable<AccountResponse>({stale: true})
    loadAccount(Name.from(name), chainId, store.set, refresh).catch((error) => {
        console.warn(`Unable to load account ${name} on ${chainId}`, error)
        store.update((account) => ({...account, error}))
    })
    return store
}
