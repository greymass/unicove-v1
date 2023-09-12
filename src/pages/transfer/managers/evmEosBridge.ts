import {Asset} from 'anchor-link'
import {ethers} from 'ethers'

import { convertToEvmAddress, getProvider } from '~/lib/evm'

import { TransferManager } from './transferManager'

export class EvmEosBridge extends TransferManager {
    static from = 'evm'
    static fromDisplayString = 'EOS (EVM)'
    static to = 'eos'
    static toDisplayString = 'EOS'
    static supportedChains = ['eos']
    static evmRequired = true;

    async transferFee(amount: string) {
        const {gas, gasPrice} = await this.estimateGas(amount)
    
        const eosAmount = ethers.utils.formatEther(Number(gas) * Number(gasPrice))
    
        return Asset.fromFloat(Number(eosAmount), this.evmSession.chainConfig.nativeCurrency.symbol)
    }

    async transfer(amount: string) {
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

    async balance() {
        console.log({evmSessionInBalance: this.evmSession})
        const balance = await this.evmSession.getBalance()

        return Asset.from(balance)
    }
}
