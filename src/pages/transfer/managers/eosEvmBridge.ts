import {Asset, Name} from 'anchor-link'

import {Transfer} from '~/abi-types'
import {getClient} from '~/api-client'
import {TransferManager} from './transferManager'

const bridgeFees: Record<string, number> = {
    USDT: 0.01,
    SEOS: 0.1,
    BOX: 0.1,
    USN: 0.1,
}

export class EosEvmBridge extends TransferManager {
    static supportedChains = ['eos']
    static evmRequired = true

    get fromAddress() {
        return String(this.nativeSession.auth.actor)
    }

    get toAddress() {
        return this.evmSession.address
    }

    async transferFee(_amount: string, tokenSymbol: Asset.SymbolType = '4,EOS') {
        const symbolCode = String(Asset.Symbol.from(tokenSymbol).code)
        if (bridgeFees[symbolCode]) {
            return Asset.from(bridgeFees[symbolCode], tokenSymbol)
        }

        const apiClient = getClient(this.nativeSession.chainId)

        let apiResponse

        try {
            apiResponse = await apiClient.v1.chain.get_table_rows({
                code: 'eosio.evm',
                scope: 'eosio.evm',
                table: 'config',
            })
        } catch (err) {
            throw new Error('Failed to get config table from eosio.evm. Full error: ' + err)
        }

        const config = apiResponse.rows[0]

        const ingressBridgeFee = Asset.from(config.ingress_bridge_fee || '0.0000 EOS')

        return Asset.from(ingressBridgeFee.value, tokenSymbol)
    }

    transfer(amount: string, tokenSymbol: Asset.SymbolType = '4,EOS') {
        const action = Transfer.from({
            from: this.nativeSession.auth.actor,
            to: 'eosio.evmin',
            quantity: String(Asset.fromFloat(Number(amount), tokenSymbol)),
            memo: this.evmSession.address,
        })

        return this.nativeSession.transact({
            action: {
                authorization: [this.nativeSession.auth],
                account: Name.from(this.transferData.tokenContract || 'eosio.token'),
                name: Name.from('transfer'),
                data: action,
            },
        })
    }
}
