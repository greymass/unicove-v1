import type {API, ChainId, Name, NameType} from 'anchor-link'
import {Asset} from 'anchor-link'
import type {Readable} from 'svelte/store'

type Subscriber = (value: Account) => void

/** Mutable & reactive object representing an EOSIO account. */
export class Account implements Readable<Account> {
    /** Chain id where account exists. */
    readonly chainId: ChainId
    /** Name of the account. */
    readonly name: Name
    /** Core symbol chain account is on uses. */
    readonly coreLiquidBalance: Asset

    static load(name: NameType) {
        // TODO
    }

    constructor(chainId: ChainId, account: API.v1.AccountObject) {
        this.chainId = chainId
        this.name = account.account_name
        this.coreLiquidBalance = account.core_liquid_balance || Asset.from('0.0000 EOS') // TODO: add core symbol to chain config and use that to create zero balance with correct symbol
    }

    /** Re-load account from API. */
    reload() {
        // TODO
    }

    // Svelte Readable implementation

    private subscribers: Subscriber[] = []

    subscribe(subscriber: Subscriber, wat: any) {
        this.subscribers.push(subscriber)
        console.log('sub', subscriber, this.subscribers.length, wat)
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
