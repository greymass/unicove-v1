import type { NameType } from 'anchor-link'

import {EvmTelosBridge} from './evmTelosBridge'
import {EosEvmBridge} from './eosEvmBridge'
import {EvmEosBridge} from './evmEosBridge'
import {TelosEvmBridge} from './telosEvmBridge'
import type {TransferManager} from './transferManager'

export interface TransferType {
    transferClass: typeof TransferManager
    tokenName: string
    tokenContract: NameType
    from: string
    fromLabel: string
    to: string
    toLabel: string
}

export const transferManagers: {[key: string]: TransferType} = {
    'EOS - EOS (EVM)': {
        transferClass: EosEvmBridge,
        tokenName: 'EOS',
        tokenContract: 'eosio.token',
        from: 'eos',
        fromLabel: 'EOS',
        to: 'evm',
        toLabel: 'EOS (EVM)',
    },
    'EOS (EVM) - EOS': {
        transferClass: EvmEosBridge,
        tokenName: 'EOS (EVM)',
        tokenContract: 'eosio.evm',
        from: 'evm',
        fromLabel: 'EOS (EVM)',
        to: 'eos',
        toLabel: 'EOS',
    },
    'USDT - USDT (EVM)': {
        transferClass: EosEvmBridge,
        tokenName: 'USDT',
        tokenContract: 'tethertether',
        from: 'usdt',
        fromLabel: 'USDT',
        to: 'evm',
        toLabel: 'USDT (EVM)',
    },
    'USDT (EVM) - USDT': {
        transferClass: EvmEosBridge,
        tokenName: 'USDT (EVM)',
        tokenContract: 'eosio.evm',
        from: 'evm',
        fromLabel: 'USDT (EVM)',
        to: 'usdt',
        toLabel: 'USDT',
    },
    'TLOS - TLOS (EVM)': {
        transferClass: TelosEvmBridge,
        tokenName: 'TLOS',
        tokenContract: 'eosio.token',
        from: 'tlos',
        fromLabel: 'TLOS',
        to: 'evm',
        toLabel: 'TLOS (EVM)',
    },
    'TLOS (EVM) - TLOS': {
        transferClass: EvmTelosBridge,
        tokenName: 'TLOS (EVM)',
        tokenContract: 'telos.evm',
        from: 'evm',
        fromLabel: 'TLOS (EVM)',
        to: 'tlos',
        toLabel: 'TLOS',
    },
}
