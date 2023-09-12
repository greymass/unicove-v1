import type { Asset, LinkSession, TransactResult } from "anchor-link";
import type { ethers } from "ethers";

import type { EvmSession } from "~/lib/evm";
import {valueInFiat} from '~/lib/fiat'
import { getSystemTokenPrice } from "~/store";

export abstract class TransferManager {
    static from: string
    static to: string
    static fromDisplayString: string
    static toDisplayString: string
    static supportedChains: string[]
    static evmRequired: boolean = false

    readonly nativeSession: LinkSession
    readonly evmSession: EvmSession

    constructor(nativeSession: LinkSession, evmSession: EvmSession) {
        this.nativeSession = nativeSession
        this.evmSession = evmSession
    }

    transfer(_amount: string): Promise<TransactResult | ethers.providers.TransactionResponse> {
        throw new Error('transfer() not implemented')
    }

    transferFee(_amount?: string): Promise<Asset> {
        throw new Error('transferFee() not implemented')
    }

    balance(): Promise<Asset> {
        throw new Error('balance() not implemented')
    }

    updateBalances(): Promise<void> {
        throw new Error('updateBalances() not implemented')
    }

    async convertToUsd(amount: number): Promise<string> {
        const systemTokenPrice = await getSystemTokenPrice()

        return valueInFiat(amount, systemTokenPrice)
    }

    // onSelect(): Promise<void> {
    //     // This may be needed in the future
    //     throw new Error('onSelect() not implemented')
    // }

    get from() {
        return TransferManager.from
    }

    get to() {
        return TransferManager.to
    }

    get fromDisplayString() {
        return TransferManager.fromDisplayString
    }

    get toDisplayString() {
        return TransferManager.toDisplayString
    }

    get supportedChains() {
        return TransferManager.supportedChains
    }

    get evmRequired() {
        return TransferManager.evmRequired
    }
}