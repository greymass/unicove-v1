import type {LinkSession} from 'anchor-link'
import {Asset, Name} from 'anchor-link'
import {ethers} from 'ethers'

import BN from 'bn.js'

import {Transfer} from '~/abi-types'
import {getClient} from '~/api-client'
import { EvmBridge, convertToEvmAddress, getProvider } from '../evm'

export class EvmEosBridge extends EvmBridge {
    static async connect(): Promise<EvmBridge> {
        return super.connect('eos-mainnet')
    }

    async nativeTransferFee() {
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
        
        return Asset.from(config.ingress_bridge_fee || '0.0000 EOS')
    }

    nativeTransfer(amount: string) {
        const action = Transfer.from({
            from: this.nativeSession.auth.actor,
            to: 'eosio.evm',
            quantity: String(Asset.fromFloat(Number(amount), '4,EOS')),
            memo: this.evmSession.address,
        })
    
        return this.nativeSession.transact({
            action: {
                authorization: [this.nativeSession.auth],
                account: Name.from('eosio.token'),
                name: Name.from('transfer'),
                data: action,
            },
        })
    }

    async evmTransferFee(amount: string) {
        const {gas, gasPrice} = await this.estimateGas(amount)
    
        const eosAmount = ethers.utils.formatEther(Number(gas) * Number(gasPrice))
    
        return Asset.fromFloat(Number(eosAmount), this.evmSession.chainConfig.nativeCurrency.symbol)
    }

    async evmTransfer(amount: string) {
        const targetEvmAddress = convertToEvmAddress(String(this.nativeSession.auth.actor))
    
        const {gas} = await this.estimateGas(amount)
    
        return this.evmSession.sendTransaction({
            from: this.evmSession.address,
            to: targetEvmAddress,
            value: ethers.utils.parseEther(amount),
            gasPrice: await getProvider().getGasPrice(),
            gasLimit: gas,
            data: ethers.utils.formatBytes32String(''),
        })
    }

    private async estimateGas(amount: string) {
        const provider = getProvider()
    
        const targetEvmAddress = convertToEvmAddress(String(this.nativeSession.auth.actor))
    
        const gasPrice = await provider.getGasPrice()
    
        // Reducing the amount by 0.005 EOS to avoid getting an error when entire balance is sent. Proper amount is calculated once the gas fee is known.
        const reducedAmount = String(Number(amount) - 0.005)
    
        const gas = await provider.estimateGas({
            from: this.evmSession.address,
            to: targetEvmAddress,
            value: ethers.utils.parseEther(reducedAmount),
            gasPrice,
            data: ethers.utils.formatBytes32String(''),
        })
    
        return {gas, gasPrice}
    }
}
