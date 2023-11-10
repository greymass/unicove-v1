import {Asset} from 'anchor-link'
import {ethers} from 'ethers'

import {convertToEvmAddress, getProvider} from '~/lib/evm'
import {TransferManager} from './transferManager'

export class EvmEosBridge extends TransferManager {
    static supportedChains = ['eos']
    static evmRequired = true

    get fromAddress() {
        return this.evmSession.address
    }

    get toAddress() {
        return String(this.nativeSession.auth.actor)
    }

    async transferFee(amount: string, tokenSymbol: Asset.SymbolType = '4,EOS') {
        const {gas, gasPrice} = await this.estimateGas(amount)

        const feeAmount = ethers.utils.formatEther(Number(gas) * Number(gasPrice))

        return Asset.fromFloat(Number(amount), tokenSymbol)
    }

    async transfer(amount: string, _tokenSymbol: Asset.SymbolType, amountReceived?: string) {
        const targetEvmAddress = convertToEvmAddress(String(this.nativeSession.auth.actor))

        const amountToTransfer = amountReceived || amount

        const {gas} = await this.estimateGas(amountToTransfer)

        // In the case of an USDT transfer, we must construct the transaction differently here
        // From EVM bridge FE:
        //
        // USDT
        //   const fee = await this.erc20_contract().methods.egressFee().call()
        //   let tx = {
        //     from: this.address,
        //     to: this.erc20_addr(),
        //     value: fee,
        //     gasPrice: this.gasPrice,
        //     data: this.erc20_contract().methods.bridgeTransfer(this.addressEvm, this.transferValue, this.memo).encodeABI(),
        //   }
  
        //   if (gaslimit != null) {
        //     tx.gas = gaslimit;
        //   }
        //   return tx
        //

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
}
