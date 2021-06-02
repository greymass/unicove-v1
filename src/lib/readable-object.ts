import type {Readable} from 'svelte/store'

type Subscriber<T> = (value: T) => void

/**
 * Svelte store compatible object that can notify its subscribers it has changed.
 * Subclasses need to specify their own type due to limitations of the TypeScript type-system, for example:
 * ```
 * class MyReadable extends ReadableObject<MyReadable> { .. }
 * ```
 */
export abstract class ReadableObject<T> implements Readable<T> {
    private subscribers: Subscriber<T>[] = []

    /** Subscribe to changes of object. */
    subscribe(subscriber: Subscriber<T>) {
        if (this.subscribers.length === 0 && this.subscriptionBecameActive) {
            this.subscriptionBecameActive()
        }
        this.subscribers.push(subscriber)
        subscriber(this as any)
        return () => {
            let idx = this.subscribers.indexOf(subscriber)
            if (idx !== -1) {
                this.subscribers.splice(idx, 1)
            }
            if (this.subscribers.length === 0 && this.subscriptionBecameInactive) {
                this.subscriptionBecameInactive()
            }
        }
    }

    /** Notify subscribers that object changed. */
    didChange() {
        for (const subscriber of this.subscribers) {
            subscriber(this as any)
        }
    }

    /** Called on first subscriber. */
    subscriptionBecameActive?(): void

    /** Called after when last subscriber unsubscribes. */
    subscriptionBecameInactive?(): void
}
