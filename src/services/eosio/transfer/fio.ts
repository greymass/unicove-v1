import {Asset, LinkSession, UInt64} from 'anchor-link'
import type {ChainConfig} from '~/config'

export async function loadFee(activeBlockchain: ChainConfig, activeSession: LinkSession) {
    const fees = await activeSession!.client.v1.chain.get_table_rows({
        code: 'fio.fee',
        table: 'fiofees',
        scope: 'fio.fee',
        key_type: 'i64',
        index_position: 'primary',
        lower_bound: UInt64.from(5),
        upper_bound: UInt64.from(5),
        limit: 1,
    })

    return Asset.fromUnits(fees.rows[0].suf_amount, activeBlockchain.coreTokenSymbol)
}

export async function loadBalance(activeBlockchain: ChainConfig, activeSession: LinkSession) {
    return activeSession!.client.v1.chain.get_currency_balance(
        activeBlockchain.coreTokenContract,
        activeSession!.auth.actor
    )
}
