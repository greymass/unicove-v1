import type { Asset, LinkSession, TransactResult } from "anchor-link";
import type { EvmSession } from "../../lib/evm";
import { EvmEosBridge } from "../../lib/evm/eos";
import type { ethers } from "ethers";

export interface TransferParams {
    amount: string
    evmSession?: EvmSession
    nativeSession: LinkSession
}

export interface TransferFeeParams {
    amount?: string
    evmSession?: EvmSession
    nativeSession: LinkSession
}

export interface TransferType {
    from: string
    fromString: string
    to: string
    toString: string
    onSelect?: () => Promise<void>
    transferFee?: (arg0: TransferFeeParams) => Promise<Asset>
    transfer: (arg0: TransferParams) => Promise<TransactResult | ethers.providers.TransactionResponse>
}

export const transferTypes: {[key: string]: TransferType } = {
    "EOS - EOS (EVM)": {
        from: "eos",
        fromString: "EOS",
        to: "evm",
        toString: "EOS (EVM)",
        // onSelect: () => connectEvmWallet("eos-mainnet"),
        transferFee: async ({nativeSession, evmSession}) => {
            throwIfNoEvmSession(evmSession)
            return new EvmEosBridge(nativeSession, evmSession!).nativeTransferFee()
        },
        transfer: async ({amount, nativeSession, evmSession}) => {
            throwIfNoEvmSession(evmSession)
            return new EvmEosBridge(nativeSession, evmSession!).nativeTransfer(amount)
        }
    },
    "EOS (EVM) - EOS": {
        from: "evm",
        fromString: "EOS (EVM)",
        to: "eos",
        toString: "EOS",
        // onSelect: () => connectEvmWallet('eos-mainnet'),
        transferFee: async ({nativeSession, evmSession, amount}) => {
            throwIfNoEvmSession(evmSession)
            if (!amount) { throw new Error('Amount is required to determine EVM transfer fee.') }
            return new EvmEosBridge(nativeSession, evmSession!).evmTransferFee(amount)
        },
        transfer: async ({nativeSession, evmSession, amount}) => {
            throwIfNoEvmSession(evmSession)
            return new EvmEosBridge(nativeSession, evmSession!).evmTransfer(amount)
        }
    },
    "TLOS - TLOS (EVM)": {
        from: "telos",
        fromString: "TLOS",
        to: "evm",
        toString: "TLOS (EVM)",
        // onSelect: () => connectEvmWallet('telos'),
        transfer: async ({nativeSession, evmSession, amount}) => {
            throwIfNoEvmSession(evmSession)
            return new EvmEosBridge(nativeSession, evmSession!).nativeTransfer(amount)
        }
    },
    "TLOS (EVM) - TLOS": {
        from: "evm",
        fromString: "TLOS (EVM)",
        to: "telos",
        toString: "TLOS",
        // onSelect: () => connectEvmWallet('telos'),
        transfer: async ({nativeSession, evmSession, amount}) => {
            throwIfNoEvmSession(evmSession)
            return new EvmEosBridge(nativeSession, evmSession!).nativeTransfer(amount)
        }
    },
   
}

function throwIfNoEvmSession(evmSession?: EvmSession) {
    if (!evmSession) {
        throw new Error('An evm session is required.')
    }
}