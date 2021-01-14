import type {Readable} from 'svelte/store'
import {dbPromise} from './db'

/** User preferences, persisted in user db. */
export class Preferences implements Readable<Preferences> {
    static settings: Record<string, {default: any}>

    /** Whether the side navigation bar is expanded. */
    @Setting({default: false}) expandNavbar!: boolean

    /** Preferences singleton. */
    static shared = new Preferences()

    // Settings DB Storage

    private storage: Record<string, any> = {}

    write(key: string, value: any) {
        this.storage[key] = value
        console.log(this.storage)
        this.didChange()
        this.save(key, value).catch((error) => {
            console.warn('Unable to save setting', error)
        })
    }

    read(key: string) {
        const setting = (this.constructor as typeof Preferences).settings[key]
        if (!setting) {
            throw new TypeError(`Unknown setting: ${key}`)
        }
        return this.storage[key] === undefined ? setting.default : this.storage[key]
    }

    async initStorage() {
        const db = await dbPromise
        let cursor = await db.transaction('preferences').store.openCursor()
        let found = false
        while (cursor) {
            found = true
            this.storage[cursor.key] = cursor.value
            cursor = await cursor.continue()
        }
        if (found) {
            this.didChange()
        }
    }

    private async save(key: string, value: any) {
        const db = await dbPromise
        await db.put('preferences', value, key)
    }

    // Svelte Readable implementation

    private subscribers: ((value: Preferences) => void)[] = []

    subscribe(subscriber: (value: Preferences) => void) {
        this.subscribers.push(subscriber)
        console.log('sub', subscriber, this.subscribers.length)
        subscriber(this)
        return () => {
            console.log('unsub', subscriber)
            let idx = this.subscribers.indexOf(subscriber)
            if (idx !== -1) {
                this.subscribers.splice(idx, 1)
            }
        }
    }

    private didChange() {
        for (const subscriber of this.subscribers) {
            subscriber(this)
        }
    }
}

function Setting<T>(args: {default: T}) {
    return (target: Preferences, name: string) => {
        const ctor = target.constructor as typeof Preferences
        if (!ctor.settings) ctor.settings = {}
        ctor.settings[name] = args
        function get(this: Preferences) {
            return this.read(name)
        }
        function set(this: Preferences, newValue: T) {
            this.write(name, newValue)
        }
        Object.defineProperty(target, name, {get, set})
    }
}
