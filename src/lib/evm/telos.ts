import type {ethers} from 'ethers'
import type { EvmChainConfig } from '../evm'

const evmChainConfigs: {[key: string]: EvmChainConfig} = {
    'telos': {
        chainId: '40(0x28)',
        chainName: 'Telos EVM Network',
        nativeCurrency: {name: 'TLOS', symbol: '4,TLOS', decimals: 18},
        rpcUrls: ['https://mainnet.telos.net/evm'],
        blockExplorerUrls: ['https://www.teloscan.io/'],
    },
}

let evmProvider: ethers.providers.Web3Provider

declare global {
    interface Window {
        ethereum: any
    }
}
