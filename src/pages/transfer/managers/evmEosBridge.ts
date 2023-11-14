import {Asset, PackedTransaction} from 'anchor-link'
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
        const {gas, gasPrice} = await this.estimateGas(amount, tokenSymbol)

        console.log({gas, gasPrice, gasN: Number(gas), gasPriceN: Number(gasPrice)})

        const feeAmount = ethers.utils.formatEther(Number(gas) * Number(gasPrice))

        console.log({feeAmount})

        return Asset.fromFloat(Number(feeAmount), tokenSymbol)
    }

    // async transfer(amount: string, tokenSymbol: Asset.SymbolType, amountReceived?: string) {
    //     const amountToTransfer = amountReceived || amount;
    
    //     const { gas, gasPrice } = await this.estimateGas(amountToTransfer, tokenSymbol);
    
    //     const transaction = this.transactionParams(amountToTransfer, tokenSymbol);
    
    //     return this.evmSession.sendTransaction({
    //         ...transaction,
    //         gasPrice,
    //         gasLimit: gas,
    //     });
    // }    

    async transfer(amount: string, tokenSymbol: Asset.SymbolType, amountReceived?: string) {   
        const amountToTransfer = amountReceived || amount;
    
        const { gas } = await this.estimateGas(amountToTransfer);
    
        const transaction = await this.transactionParams(amountToTransfer, tokenSymbol);
    
        return this.evmSession.sendTransaction({
            ...transaction,
            gasLimit: gas,
        });
    }
    

    private async transactionParams(amount: string, tokenSymbol: Asset.SymbolType) {
        const token = this.evmSession.getTokens().find((t) => t.symbol === String(tokenSymbol));
    
        if (!token) {
            throw new Error(`Token ${tokenSymbol} not found`);
        }

        console.log({token, tokenSymbol})

        const erc20Contract = this.evmSession.erc20Contract(token);
    
        let data;
        let egressFee;

        const targetEvmAddress = convertToEvmAddress(String(this.nativeSession.auth.actor));
    
        if (erc20Contract) {
            const erc20Interface = this.evmSession.erc20Interface();

            console.log({
                targetEvmAddress,
                amount: String(ethers.utils.parseUnits(amount, 'ether')),
            })
            // Correctly encode the bridgeTransfer function
            data = erc20Interface.encodeFunctionData("bridgeTransfer", [targetEvmAddress, ethers.utils.parseUnits(amount, 'mwei'), '']);
            
            egressFee = await erc20Contract.egressFee();
        } else {
            data = ethers.utils.formatBytes32String('');
        }

        console.log({
            token,
            from: this.evmSession.address,
            to: token.address || targetEvmAddress,
            value: String(erc20Contract ? egressFee || 0 : amount), // For ERC20 transfers, this is often 0
            gasPrice: String(await getProvider().getGasPrice()),
            data,
        })
    
        return {
            from: this.evmSession.address,
            to: token.address || targetEvmAddress,
            value: erc20Contract ? egressFee || 0 : amount, // For ERC20 transfers, this is often 0
            gasPrice: await getProvider().getGasPrice(),
            data,
        };
    }
    

    private async estimateGas(amount: string, tokenSymbol: Asset.SymbolType = '4,EOS') {
        const provider = getProvider()

        const gasPrice = await provider.getGasPrice()

        // Reducing the amount by 0.005 EOS to avoid getting an error when entire balance is sent. Proper amount is calculated once the gas fee is known.
        const reducedAmount = String(Number(amount))

        const transaction = await this.transactionParams(reducedAmount, tokenSymbol)

        const gas = await provider.estimateGas(transaction)

        console.log({ gas })

        return {gas, gasPrice}
    }
}