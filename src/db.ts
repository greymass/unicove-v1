import {DBSchema, openDB} from 'idb'

const dbVersion = 2

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
    },
})
