import type { Asset } from 'anchor-link'

import {EvmTelosBridge} from './evmTelosBridge'
import {EosEvmBridge} from './eosEvmBridge'
import {EvmEosBridge} from './evmEosBridge'
import {TelosEvmBridge} from './telosEvmBridge'
import type {TransferManager} from './transferManager'

interface TransferType {
    transferClass: typeof TransferManager
    tokenSymbol: Asset.SymbolType
}

export const transferManagers: {[key: string]: TransferType} = {
    'EOS - EOS (EVM)': {
        transferClass: EosEvmBridge,
        tokenSymbol: '4,EOS'
    },
    'EOS (EVM) - EOS': {
        
    }
    'EOS (EVM) - EOS': EvmEosBridge,
    'USDT - USDT (EVM)': EosEvmBridge,
    'USDT (EVM) - USDT': EvmEosBridge,
    'TLOS - TLOS (EVM)': TelosEvmBridge,
    'TLOS (EVM) - TLOS': EvmTelosBridge,
}
