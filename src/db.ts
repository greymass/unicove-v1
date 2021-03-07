import type {DBSchema, StoreKey, StoreNames, StoreValue} from 'idb'
import {openDB} from 'idb'
import {readable, ReadableResult} from 'svelte-result-store'

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
 * Cached data source, will return initial stale values up to maxAge and refresh every refreshInterval.
 * @note Load function must return a IDB compatible object (i.e. no core objects, pass them through Serializer.objectify)
 */
export function cachedRead<
    Names extends StoreNames<WalletDB>,
    Value extends StoreValue<WalletDB, Names>
>(args: {
    store: Names
    key: StoreKey<WalletDB, Names>
    load: () => Promise<Value['data']>
    refreshInterval: number
    maxAge: number
}): ReadableResult<Value['data']> {
    return readable((set, error) => {
        const load = async () => {
            const db = await dbPromise
            const data = await args.load()
            db.put(args.store, {updated: new Date(), data} as Value, args.key).catch((error) => {
                console.warn(`Error caching ${args.store}:${args.key}`, error)
            })
            return data
        }
        const init = async () => {
            const db = await dbPromise
            const existing = await db.get(args.store, args.key)
            let value: Value['data'] | undefined
            if (existing && existing.updated && existing.data !== undefined) {
                const age = Date.now() - existing.updated.getTime()
                if (age < args.maxAge) {
                    value = existing.data
                    if (age > args.refreshInterval) {
                        load().then(set).catch(error)
                    }
                }
            }
            if (value === undefined) {
                value = await load()
            }
            set(value)
        }
        init().catch(error)
        const timer = setInterval(() => {
            load().then(set).catch(error)
        }, args.refreshInterval)
        return () => {
            clearInterval(timer)
        }
    })
}
