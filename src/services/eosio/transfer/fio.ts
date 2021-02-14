import {Asset, LinkSession, UInt64} from 'anchor-link'
import {FIOTransfer} from '~/abi-types'
import type {ChainConfig} from '~/config'
import type {TransferData} from '~/services/eosio/methods'

export async function fioTransfer(
    activeBlockchain: ChainConfig,
    activeSession: LinkSession,
    transferProperties: TransferData
) {
    const txFee = await loadFee(activeBlockchain, activeSession)
    const fioTransfer = generateTransfer(activeSession, transferProperties, txFee)
    transact(activeBlockchain, activeSession, fioTransfer)
}

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

function generateTransfer(
    activeSession: LinkSession,
    transferProperties: TransferData,
    txFee: Asset
) {
    const {quantity, toAddress} = transferProperties

    return FIOTransfer.from({
        payee_public_key: toAddress,
        amount: quantity && quantity.units,
        max_fee: txFee.units,
        actor: activeSession!.auth.actor,
        tpid: 'tpid@greymass',
    })
}

async function transact(
    activeBlockchain: ChainConfig,
    activeSession: LinkSession,
    fioTransfer: FIOTransfer
) {
    return await activeSession!.transact({
        action: {
            authorization: [activeSession!.auth],
            account: activeBlockchain.coreTokenContract,
            name: activeBlockchain.coreTokenTransfer,
            data: fioTransfer,
        },
    })
}
