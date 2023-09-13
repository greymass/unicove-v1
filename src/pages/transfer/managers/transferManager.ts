import type {Asset, LinkSession, TransactResult} from "anchor-link";
import type {ethers} from "ethers";

import type {EvmSession} from "~/lib/evm";
import {valueInFiat} from '~/lib/fiat'
import {getSystemTokenPrice} from "~/store";

export abstract class TransferManager {
    self: typeof TransferManager
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
        this.self = this.constructor as typeof TransferManager
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

    get fromAddress(): string {
        throw new Error('fromAddress() not implemented')
    }

    get toAddress(): string {
        throw new Error('toAddress() not implemented')
    }

    get from() {
        return this.self.from
    }

    get to() {
        return this.self.to
    }

    get fromDisplayString() {
        return this.self.fromDisplayString
    }

    get toDisplayString() {
        return this.self.toDisplayString
    }

    get supportedChains() {
        return this.self.supportedChains
    }

    get evmRequired() {
        return this.self.evmRequired
    }
}