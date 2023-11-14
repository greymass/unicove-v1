import {Asset, PackedTransaction} from 'anchor-link'
import {ethers} from 'ethers'

import {convertToEvmAddress, fromWei, getProvider, weiToAmount} from '~/lib/evm'
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
        const {gas, gasPrice, egressFee} = await this.estimateFee(amount, tokenSymbol)

        const feeAmount = Number(ethers.utils.formatEther(gasPrice)) * Number(gas)

        const egressAmount = Number(ethers.utils.formatEther(egressFee))

        return Asset.fromFloat(Number(feeAmount) + Number(egressAmount) , '4,EOS')
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
    
        const { gas } = await this.estimateFee(amountToTransfer);
    
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
    
        return {
            from: this.evmSession.address,
            to: token.address || targetEvmAddress,
            value: erc20Contract ? egressFee || 0 : amount, // For ERC20 transfers, this is often 0
            gasPrice: await getProvider().getGasPrice(),
            data,
        };
    }
    

    private async estimateFee(amount: string, tokenSymbol: Asset.SymbolType = '4,EOS') {
        const token = this.evmSession.getToken(tokenSymbol);

        const provider = getProvider()

        const gasPrice = await provider.getGasPrice()

        const transaction = await this.transactionParams(amount, tokenSymbol)

        const gas = await provider.estimateGas(transaction)

        let egressFee

        if (token.address) {
            egressFee = transaction.value
        }
        
        console.log({ gas, egressFee })

        return {gas, gasPrice, egressFee}
    }
}