import type {LinkSession} from 'anchor-link'
import type {ChainConfig} from '~/config'

import {Transfer} from '~/abi-types'

export async function defaultTransfer(
    activeBlockchain: ChainConfig,
    activeSession: LinkSession,
    transferProperties: Transfer
) {
    const data: Transfer = generateTransfer(activeSession, transferProperties)

    console.log({data})

    transact(activeBlockchain, activeSession, data)
}

function generateTransfer(activeSession: LinkSession, transferProperties: Transfer) {
    const {quantity, to, memo} = transferProperties

    return Transfer.from({
        from: activeSession!.auth.actor,
        to,
        quantity,
        memo,
    })
}

async function transact(
    activeBlockchain: ChainConfig,
    activeSession: LinkSession,
    transferData: Transfer
) {
    return await activeSession!.transact({
        action: {
            authorization: [activeSession!.auth],
            account: activeBlockchain.coreTokenContract,
            name: activeBlockchain.coreTokenTransfer,
            data: transferData,
        },
    })
}
