import type {LinkSession} from 'anchor-link'
import type {ChainConfig} from '~/config'
import type {TransferData} from '~/services/eosio/methods'

import {Transfer} from '~/abi-types'

export function defaultTransfer(
    activeBlockchain: ChainConfig,
    activeSession: LinkSession,
    transferProperties: TransferData
) {
    const data: Transfer = generateTransfer(activeSession, transferProperties)

    return transact(activeBlockchain, activeSession, data)
}

function generateTransfer(activeSession: LinkSession, transferProperties: TransferData) {
    const {quantity, toAccount, memo} = transferProperties

    return Transfer.from({
        from: activeSession!.auth.actor,
        to: toAccount,
        quantity,
        memo,
    })
}

async function transact(
    activeBlockchain: ChainConfig,
    activeSession: LinkSession,
    transferData: Transfer
) {
    return activeSession!.transact({
        action: {
            authorization: [activeSession!.auth],
            account: activeBlockchain.coreTokenContract,
            name: activeBlockchain.coreTokenTransfer,
            data: transferData,
        },
    })
}
