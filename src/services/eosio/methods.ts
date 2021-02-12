import type {Asset, LinkSession} from 'anchor-link'
import {isInstanceOf} from '@greymass/eosio'

import {fioTransfer} from './transfer/fio'
import {defaultTransfer} from './transfer/default'

import type {ChainConfig} from '~/config'

export interface TransferData {
    id: string
    memo: string
    quantity: Asset
    toAccount: string
    toAddress: string
    txFee: Asset
}

export function transfer(
    activeBlockchain: ChainConfig,
    activeSession: LinkSession,
    properties: TransferData
) {
    if (activeBlockchain.id === 'fio') {
        return fioTransfer(activeBlockchain, activeSession, properties)
    } else {
        return defaultTransfer(activeBlockchain, activeSession, properties)
    }
}
