import type {DBSchema, StoreKey, StoreNames, StoreValue} from 'idb'
import {openDB} from 'idb'

const dbVersion = 3

interface WalletDB extends DBSchema {
    'account-cache': {
        key: string // <chain_id>-<account_name>
        value: {
            updated: Date // last fetched
            account: any // JSON encoded API.v1.AccountObject
        }
        indexes: {
            'by-updated': Date
        }
    }
    preferences: {
        key: string
        value: any
    }
    'price-ticker': {
        key: string
        value: {
            updated: Date
            data: any
        }
        indexes: {
            'by-updated': Date
        }
    }
}

export const dbPromise = openDB<WalletDB>('wallet', dbVersion, {
    upgrade(db, version) {
        if (version < 1) {
            const accountCache = db.createObjectStore('account-cache')
            accountCache.createIndex('by-updated', 'updated', {unique: false})
        }
        if (version < 2) {
            db.createObjectStore('preferences')
        }
        if (version < 3) {
            const priceTicker = db.createObjectStore('price-ticker')
            priceTicker.createIndex('by-updated', 'updated', {unique: false})
        }
    },
})

/**
 * Cached read from given store.
 * Caches up to maxAge and does stale-while-revalidate between updateAge and maxAge.
 * Load function must return a IDB compatible object (i.e. no core objects, call Serializer.objectify before)
 */
export async function cachedRead<
    Store extends StoreNames<WalletDB>,
    Value extends StoreValue<WalletDB, Store>
>(args: {
    store: Store
    key: StoreKey<WalletDB, Store>
    load: () => Promise<Value['data']>
    updateAge: number
    maxAge: number
}): Promise<Value['data']> {
    const db = await dbPromise
    const load = async () => {
        const data = await args.load()
        db.put(args.store, {updated: new Date(), data} as Value, args.key).catch((error) => {
            console.warn(`Error writing ${args.store}:${args.key}`, error)
        })
        return data
    }
    const existing = await db.get(args.store, args.key)
    let rv: Value['data'] | undefined
    if (existing && existing.updated && existing.data !== undefined) {
        const age = Date.now() - existing.updated.getTime()
        if (age < args.maxAge) {
            rv = existing.data
            if (age > args.updateAge) {
                load().catch((error) => {
                    console.warn(`Error refreshing ${args.store}:${args.key}`, error)
                })
            }
        }
    }
    if (rv === undefined) {
        rv = await load()
    }
    return rv
}
