import type {NameType} from 'anchor-link'

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
    // EOS Bridges
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
    'SEOS - SEOS (EVM)': {
        transferClass: EosEvmBridge,
        tokenName: 'SEOS',
        tokenContract: '0xbfb10f85b889328e4a42507e31a07977ae00eec6',
        from: 'seos',
        fromLabel: 'SEOS',
        to: 'evm',
        toLabel: 'SEOS (EVM)',
    },
    'SEOS (EVM) - SEOS': {
        transferClass: EvmEosBridge,
        tokenName: 'SEOS (EVM)',
        tokenContract: 'eosio.evm',
        from: 'evm',
        fromLabel: 'SEOS (EVM)',
        to: 'seos',
        toLabel: 'SEOS',
    },
    'BOX - BOX (EVM)': {
        transferClass: EosEvmBridge,
        tokenName: 'BOX',
        tokenContract: 'token.box',
        from: 'box',
        fromLabel: 'BOX',
        to: 'evm',
        toLabel: 'BOX (EVM)',
    },
    'BOX (EVM) - BOX': {
        transferClass: EvmEosBridge,
        tokenName: 'BOX (EVM)',
        tokenContract: 'eosio.evm',
        from: 'evm',
        fromLabel: 'BOX (EVM)',
        to: 'box',
        toLabel: 'BOX',
    },
    'USN - USN (EVM)': {
        transferClass: EosEvmBridge,
        tokenName: 'USN',
        tokenContract: 'danchortoken',
        from: 'usn',
        fromLabel: 'USN',
        to: 'evm',
        toLabel: 'USN (EVM)',
    },
    'USN (EVM) - USN': {
        transferClass: EvmEosBridge,
        tokenName: 'USN (EVM)',
        tokenContract: 'eosio.evm',
        from: 'evm',
        fromLabel: 'USN (EVM)',
        to: 'usn',
        toLabel: 'USN',
    },

    // Telos Bridges
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
        tokenContract: 'eosio.evm',
        from: 'evm',
        fromLabel: 'TLOS (EVM)',
        to: 'tlos',
        toLabel: 'TLOS',
    },
}
