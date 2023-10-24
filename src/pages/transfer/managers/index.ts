import type { Asset, AssetType } from 'anchor-link'

import {EvmTelosBridge} from './evmTelosBridge'
import {EosEvmBridge} from './eosEvmBridge'
import {EvmEosBridge} from './evmEosBridge'
import {TelosEvmBridge} from './telosEvmBridge'
import type {TransferManager} from './transferManager'

interface TransferType {
    transferClass: typeof TransferManager
    token: AssetType
}

export const transferManagers: {[key: string]: TransferType} = {
    'EOS - EOS (EVM)': {
        transferClass: EosEvmBridge,
        token: 'EOS'
    },
    'EOS (EVM) - EOS': {
        transferClass: EvmEosBridge,
        token: 'EOS'
    },
    'USDT - USDT (EVM)': {
        transferClass: EosEvmBridge,
        token: 'USDT'
    },
    'USDT (EVM) - USDT': {
        transferClass: EvmEosBridge,
        token: 'USDT'
    },
    'TLOS - TLOS (EVM)': {
        transferClass: TelosEvmBridge,
        token: 'TLOS'
    },
    'TLOS (EVM) - TLOS': {
        transferClass: EvmTelosBridge,
        token: 'TLOS'
    },
}
