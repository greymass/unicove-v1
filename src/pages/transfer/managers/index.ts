import type { NameType } from 'anchor-link'

import {EvmTelosBridge} from './evmTelosBridge'
import {EosEvmBridge} from './eosEvmBridge'
import {EvmEosBridge} from './evmEosBridge'
import {TelosEvmBridge} from './telosEvmBridge'
import type {TransferManager} from './transferManager'

interface TransferType {
    transferClass: typeof TransferManager
    tokenKey: string
    tokenContract: NameType
    from: string
    fromLabel: string
    to: string
    toLabel: string
}

export const transferManagers: {[key: string]: TransferType} = {
    'EOS - EOS (EVM)': {
        transferClass: EosEvmBridge,
        tokenKey: 'eos', // change these for actual token key
        tokenContract: 'eosio.token',
        from: 'eos',
        fromLabel: 'EOS',
        to: 'evm',
        toLabel: 'EOS (EVM)',
    },
    'EOS (EVM) - EOS': {
        transferClass: EvmEosBridge,
        tokenKey: 'evm-eos',
        tokenContract: 'eosio.token',
        from: 'evm',
        fromLabel: 'EOS (EVM)',
        to: 'eos',
        toLabel: 'EOS',
    },
    'USDT - USDT (EVM)': {
        transferClass: EosEvmBridge,
        tokenKey: 'usdt',
        tokenContract: 'tethertether',
        from: 'usdt',
        fromLabel: 'USDT',
        to: 'evm',
        toLabel: 'USDT (EVM)',
    },
    'USDT (EVM) - USDT': {
        transferClass: EvmEosBridge,
        tokenKey: 'evm-usdt',
        tokenContract: 'tethertether',
        from: 'evm',
        fromLabel: 'USDT (EVM)',
        to: 'usdt',
        toLabel: 'USDT',
    },
    'TLOS - TLOS (EVM)': {
        transferClass: TelosEvmBridge,
        tokenKey: 'tlos',
        tokenContract: 'telos.token',
        from: 'tlos',
        fromLabel: 'TLOS',
        to: 'evm',
        toLabel: 'TLOS (EVM)',
    },
    'TLOS (EVM) - TLOS': {
        transferClass: EvmTelosBridge,
        tokenKey: 'evm-tlos',
        tokenContract: 'telos.evm',
        from: 'evm',
        fromLabel: 'TLOS (EVM)',
        to: 'tlos',
        toLabel: 'TLOS',
    },
}
