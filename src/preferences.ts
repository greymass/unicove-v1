import {dbPromise} from './db'
import {ReadableObject} from './lib/readable-object'

/** User preferences, persisted in user db. */
export class Preferences extends ReadableObject<Preferences> {
    static settings: Record<string, {default: any}>

    /** Whether the side navigation bar is expanded. */
    @Setting({default: false}) expandNavbar!: boolean

    /** Whether the side navigation bar advanced section is expanded. */
    @Setting({default: false}) expandNavbarAdvanced!: boolean

    /** Dark mode override. */
    @Setting({default: null})
    darkmode!: boolean | null

    /** Preferences singleton. */
    static shared = new Preferences()

    // Settings DB Storage

    private storage: Record<string, any> = {}

    write(key: string, value: any) {
        this.storage[key] = value
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
