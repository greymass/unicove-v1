import {writable, get} from 'svelte/store'
import {Asset, UInt64} from '@wharfkit/antelope'
import type {ChainConfig} from '~/config'
import {activeBlockchain, activeSession} from '~/store'
import type {Session} from '@wharfkit/session'

let interval: any

export const txFee = writable<Asset | undefined>(undefined)

export function syncTxFee() {
    interval = setInterval(() => {
        fetchTxFee().catch((error) => {
            console.warn('An error occured while fetching FIO tx fee amount', error)
        })
    }, 15 * 60 * 1000)
}

export function stopSyncTxFee() {
    clearInterval(interval)
}

export async function fetchTxFee() {
    const session: Session | undefined = get(activeSession)
    const blockchain: ChainConfig = get(activeBlockchain)

    let fee: Asset | undefined

    if (blockchain.id === 'fio') {
        const fees = await session?.client.v1.chain.get_table_rows({
            code: 'fio.fee',
            table: 'fiofees',
            scope: 'fio.fee',
            key_type: 'i64',
            index_position: 'primary',
            lower_bound: UInt64.from(5),
            upper_bound: UInt64.from(5),
            limit: 1,
        })

        fee = Asset.fromUnits(fees?.rows[0].suf_amount || 0, blockchain.coreTokenSymbol)
    }

    txFee.set(fee)
}
