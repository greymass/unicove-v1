import {Asset} from 'anchor-link'
import {ethers} from 'ethers'

import {convertToEvmAddress, getProvider} from '~/lib/evm'

import {TransferManager} from './transferManager'
import {updateEvmBalance} from '~/stores/balances-provider'
import {updateActiveAccount} from '~/stores/account-provider'
import {get} from 'svelte/store'
import {currentAccountBalance, evmBalance} from '~/store'

export class EvmEosBridge extends TransferManager {
    static from = 'evm'
    static fromDisplayString = 'EOS (EVM)'
    static to = 'eos'
    static toDisplayString = 'EOS'
    static supportedChains = ['eos']
    static evmRequired = true

    get fromAddress() {
        return this.evmSession.address
    }

    get toAddress() {
        return String(this.nativeSession.auth.actor)
    }

    async transferFee(amount: string) {
        const {gas, gasPrice} = await this.estimateGas(amount)

        const eosAmount = ethers.utils.formatEther(Number(gas) * Number(gasPrice))

        return Asset.fromFloat(Number(eosAmount), this.evmSession.getNativeToken().symbol)
    }

    async transfer(amount: string, _tokenSymbol: Asset.SymbolType, amountReceived?: string) {
        const targetEvmAddress = convertToEvmAddress(String(this.nativeSession.auth.actor))

        const amountToTransfer = amountReceived || amount

        const {gas} = await this.estimateGas(amountToTransfer)

        return this.evmSession.sendTransaction({
            from: this.evmSession.address,
            to: targetEvmAddress,
            value: ethers.utils.parseEther(amountToTransfer),
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

    updateMainBalance() {
        return updateEvmBalance()
    }
}
