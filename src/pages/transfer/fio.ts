import {writable, get} from 'svelte/store'
import {Asset, UInt64, LinkSession} from 'anchor-link'
import {wait} from '~/helpers'
import type {ChainConfig} from '~/config'
import {
    activeBlockchain,
    activeSession,
} from '~/store'

export const txFee = writable<Asset>(undefined)

export async function syncTxFee() {
    while (true) {
        await fetchFee().catch((error) => {
            console.log('An error occured while fetching tx fee amount', {error})
        })

        await wait(15 * 60 * 1000)
    }
}

export async function fetchFee() {
    const session: LinkSession = get(activeBlockchain)
    const blockchain: ChainConfig = get(fetchActiveBlockchain)

    const fees = await session.client.v1.chain.get_table_rows({
        code: 'fio.fee',
        table: 'fiofees',
        scope: 'fio.fee',
        key_type: 'i64',
        index_position: 'primary',
        lower_bound: UInt64.from(5),
        upper_bound: UInt64.from(5),
        limit: 1,
    })

    const fee = Asset.fromUnits(fees.rows[0].suf_amount, blockchain.coreTokenSymbol)

    txFee.set(fee)
}

