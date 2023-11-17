import {Asset} from 'anchor-link'
import type {LinkSession, TransactResult} from 'anchor-link'
import type {ethers} from 'ethers'

import type {EvmSession} from '~/lib/evm'
import {valueInFiat} from '~/lib/fiat'
import {activePriceTicker, waitForStoreValue} from '~/store'
import {systemToken} from '~/stores/tokens'
import type {TransferType} from './index'

export abstract class TransferManager {
    self: typeof TransferManager
    static supportedChains: string[]
    static evmRequired: boolean = false

    readonly nativeSession: LinkSession
    readonly evmSession: EvmSession
    readonly transferData: TransferType

    constructor(nativeSession: LinkSession, evmSession: EvmSession, transferData: TransferType) {
        this.nativeSession = nativeSession
        this.evmSession = evmSession
        this.transferData = transferData

        this.self = this.constructor as typeof TransferManager
    }

    /* eslint-disable @typescript-eslint/no-unused-vars */
    transfer(
        _amount: string,
        _tokenSymbol: Asset.SymbolType,
        _amountReceived?: string
    ): Promise<TransactResult | ethers.providers.TransactionResponse> {
        throw new Error('transfer() not implemented')
    }

    transferFee(_amount?: string, tokenSymbol?: Asset.SymbolType): Promise<Asset> {
        return Promise.resolve(Asset.from(0, tokenSymbol || '4,EOS'))
    }
    /* eslint-enable @typescript-eslint/no-unused-vars */

    async convertToUsd(amount: number, token?: Asset.SymbolCodeType): Promise<string | undefined> {
        const activeSystemToken = await waitForStoreValue(systemToken)

        if (token && token !== activeSystemToken.symbol.code) {
            return
        }

        const systemTokenPrice = await waitForStoreValue(activePriceTicker)

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

    get supportedChains() {
        return this.self.supportedChains
    }

    get evmRequired() {
        return this.self.evmRequired
    }
}
