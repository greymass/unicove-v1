import {DBSchema, openDB} from 'idb'

const dbVersion = 1

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
}

export const dbPromise = openDB<WalletDB>('wallet', dbVersion, {
    upgrade(db) {
        const accountCache = db.createObjectStore('account-cache')
        accountCache.createIndex('by-updated', 'updated', {unique: false})
    },
})
