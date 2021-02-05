import type {LinkSession} from 'anchor-link'
import {isInstanceOf} from '@greymass/eosio'

import {fioTransfer} from './transfer/fio'
import {defaultTransfer} from './transfer/default'

import type {ChainConfig} from '~/config'

export interface TransferData {
    amount: number
    id: string
    memo: string
    payee_public_key: string
    quantity: number
    toAccount: string
}

export function transfer(
    activeBlockchain: ChainConfig,
    activeSession: LinkSession,
    properties: TransferData
) {
    if (properties.id === 'fio') {
        return fioTransfer(activeBlockchain, activeSession, properties)
    } else {
        return defaultTransfer(activeBlockchain, activeSession, properties)
    }
}
