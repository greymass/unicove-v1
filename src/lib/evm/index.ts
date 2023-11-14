import {get} from 'svelte/store'
import BN from 'bn.js'
import {activeBlockchain, activeEvmSession, activeSession} from '~/store'
import {wait} from '~/helpers'

import {Asset, Name, NameType} from 'anchor-link'
import {BigNumber, ethers} from 'ethers'
import {getClient} from '~/api-client'

import erc20_abi from './data/erc20_abi.json'
import type { Token } from '~/stores/tokens'

export type AvailableEvms = 'eos-mainnet' | 'telos'

export interface EvmToken {
    name: string;
    symbol: string;
    decimals: number;
    address?: string,
    nativeToken?: boolean
}
export interface EvmChainConfig {
    chainId: string
    chainName: string
    tokens: EvmToken[]
    rpcUrls: string[]
    blockExplorerUrls: string[]
}

let evmProvider: ethers.providers.Web3Provider

declare global {
    interface Window {
        ethereum: any
    }
}

export const evmChainConfigs: {[key: string]: EvmChainConfig} = {
    eos: {
        chainId: '0x4571',
        chainName: 'EOS EVM Network',
        tokens: [
            {name: 'EOS', symbol: '4,EOS', decimals: 18, nativeToken: true},
            {name: 'USDT', symbol: '4,USDT', decimals: 6, address: '0x33B57dC70014FD7AA6e1ed3080eeD2B619632B8e'  },
        ],
        rpcUrls: ['https://api.evm.eosnetwork.com/'],
        blockExplorerUrls: ['https://explorer.evm.eosnetwork.com'],
    },
    telos: {
        chainId: '0x28',
        chainName: 'Telos EVM Mainnet',
        tokens: [{name: 'Telos', symbol: '4,TLOS', decimals: 18, nativeToken: true}],
        rpcUrls: ['https://mainnet.telos.net/evm'],
        blockExplorerUrls: ['https://teloscan.io'],
    },
}

export interface EvmSessionParams {
    signer: ethers.providers.JsonRpcSigner
    address: string
    chainName: string
    nativeAccountName?: NameType
}

export interface EvmSessionFromParams {
    chainName: string
    nativeAccountName?: NameType
}

export class EvmSession {
    address: string
    signer: ethers.providers.JsonRpcSigner
    chainName: string
    nativeAccountName?: NameType

    constructor({address, signer, chainName, nativeAccountName}: EvmSessionParams) {
        this.address = address
        this.signer = signer
        this.chainName = chainName
        this.nativeAccountName = nativeAccountName
    }

    get checksumAddress() {
        return this.address.replace('0x', '').toLowerCase()
    }

    get chainConfig() {
        return evmChainConfigs[this.chainName]
    }

    erc20ContractBySymbol(tokenSymbol: Asset.SymbolType) {
        const token = this.getTokens()?.find(token => token.symbol === String(tokenSymbol))

        return token && this.erc20Contract(token)
    }

    erc20Contract(token: EvmToken) {
        if (!token.address) {
            return
        }
        return new ethers.Contract(token.address, erc20_abi, this.signer);
    }

    erc20Interface() {
        return new ethers.utils.Interface(erc20_abi);
    }

    static async from({chainName, nativeAccountName}: EvmSessionFromParams) {
        if (window.ethereum) {
            const evmChainConfig = evmChainConfigs[chainName]
            const provider = getProvider()
            let network = await provider.getNetwork()
            if (network.chainId !== Number(evmChainConfig.chainId.replace('0x', ''))) {
                await switchNetwork(evmChainConfig)
                network = await provider.detectNetwork()
            }

            await window.ethereum.request({method: 'eth_requestAccounts'})
            const signer = provider.getSigner()

            await window.ethereum.get_currency_balance

            return new EvmSession({
                address: await signer.getAddress(),
                signer,
                chainName,
                nativeAccountName,
            })
        } else {
            throw new Error('You need to install Metamask in order to use this feature.')
        }
    }

    async sendTransaction(tx: ethers.providers.TransactionRequest) {
        return this.signer.sendTransaction(tx)
    }

    async getBalance(tokenName?: string) {
        if (this.chainName === 'telos') {
            return this.getTelosEvmBalance()
        }

        let token
        
        if (tokenName) {
            token = this.getToken(tokenName)
        } else {
            token = this.getNativeToken()
        }

        if (!token) {
            throw new Error('Token not found.')
        }
        
        let wei: BigNumber

        const contract = this.erc20Contract(token)

        if (contract) {
            wei = await contract.balanceOf(this.address)
        } else if (token?.nativeToken) {
            wei = await this.signer.getBalance()
        } else {
            throw new Error('Non native token must have an address.')
        }

        return weiToAmount(wei, token)
    }

    getBalances() {
        const evmChainConfig = evmChainConfigs[this.chainName]

        return Promise.all(
            evmChainConfig.tokens.map(async token => this.getBalance(token.name))
        )
    }

    getTokens() {
        const evmChainConfig = evmChainConfigs[this.chainName]

        return evmChainConfig.tokens
    }

    getToken(tokenSymbolOrCode: Asset.SymbolType | Asset.SymbolCodeType) {
        const token = this.getTokens()?.find(token => token.symbol === String(tokenSymbolOrCode) || token.name === String(tokenSymbolOrCode))

        if (!token) {
            throw new Error(`Token "${tokenSymbolOrCode}" not found.`)
        }

        return token
    }

    getNativeToken() {
        const evmChainConfig = evmChainConfigs[this.chainName]

        const nativeToken = evmChainConfig.tokens?.find(token => token.nativeToken)

        if (!nativeToken) {
            throw new Error('Native token info not found.')
        }

        return nativeToken
    }

    async getTelosEvmBalance() {
        if (!this.nativeAccountName) {
            throw new Error('Native account name is necessary to fetch Telos balance.')
        }

        const account = await getTelosEvmAccount(this.nativeAccountName)

        const nativeTokenSymbol = this.chainConfig.tokens?.find(token => token.nativeToken)?.symbol

        if (!account) {
            return Asset.from(0, nativeTokenSymbol!)
        }

        const bn = BigNumber.from(`0x${account.balance}`)

        return Asset.from(
            Number(ethers.utils.formatEther(bn)),
            nativeTokenSymbol!
        )
    }
}

export async function getTelosEvmAccount(nativeAccountName: NameType) {
    const chain = get(activeBlockchain)
    const client = getClient(chain.chainId)

    if (!client) {
        throw new Error('API client could not be instantiated')
    }

    const {rows} = await client.v1.chain.get_table_rows({
        code: 'eosio.evm',
        scope: 'eosio.evm',
        table: 'account',
        index_position: 'tertiary',
        lower_bound: Name.from(nativeAccountName),
        upper_bound: Name.from(nativeAccountName),
    })

    return rows[0]
}

export function getProvider() {
    if (evmProvider) {
        return evmProvider
    }

    if (window.ethereum) {
        evmProvider = new ethers.providers.Web3Provider(window.ethereum, 'any')
        return evmProvider
    }

    throw new Error('No provider found')
}

export function convertToEvmAddress(eosAccountName: string): string {
    const blockList = ['binancecleos', 'huobideposit', 'okbtothemoon']
    if (blockList.includes(eosAccountName)) {
        throw new Error('This CEX has not fully support the EOS-EVM bridge yet.')
    }
    return convertToEthAddress(eosAccountName)
}

function formatToken(amount: string, tokenSymbol: string) {
    return `${Number(amount).toFixed(4)} ${tokenSymbol}`
}

export async function switchNetwork(evmChainConfig: EvmChainConfig) {
    await window.ethereum
        .request({
            method: 'wallet_switchEthereumChain',
            params: [{chainId: evmChainConfig.chainId}],
        })
        .catch(async (e: {code: number}) => {
            if (e.code === 4902) {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [evmChainConfig],
                })
            }
        })
}

function convertToEthAddress(eosAddress: string) {
    try {
        return uint64ToAddr(strToUint64(eosAddress))
    } catch (err) {
        return err
    }
}

function charToSymbol(c: string) {
    const a = 'a'.charCodeAt(0)
    const z = 'z'.charCodeAt(0)
    const one = '1'.charCodeAt(0)
    const five = '5'.charCodeAt(0)
    const charCode = c.charCodeAt(0)
    if (charCode >= a && charCode <= z) {
        return charCode - a + 6
    }
    if (charCode >= one && charCode <= five) {
        return charCode - one + 1
    }
    if (c === '.') {
        return 0
    }
    throw new Error('Address include illegal character')
}

function strToUint64(str: string) {
    var n = new BN(0)
    var i = str.length
    if (i >= 13) {
        // Only the first 12 characters can be full-range ([.1-5a-z]).
        i = 12

        // The 13th character must be in the range [.1-5a-j] because it needs to be encoded
        // using only four bits (64_bits - 5_bits_per_char * 12_chars).
        n = new BN(charToSymbol(str[12]))
        if (n.gte(new BN(16))) {
            throw new Error('Invalid 13th character')
        }
    }
    // Encode full-range characters.

    while (--i >= 0) {
        n = n.or(new BN(charToSymbol(str[i])).shln(64 - 5 * (i + 1)))
    }
    return n.toString(16, 16)
}

function uint64ToAddr(str: string) {
    return '0xbbbbbbbbbbbbbbbbbbbbbbbb' + str
}

let connectingToEvm = false

export async function startEvmSession(): Promise<EvmSession | undefined> {
    let evmSession: EvmSession

    if (connectingToEvm) {
        await wait(5000)
        return startEvmSession()
    }

    connectingToEvm = true

    const blockchain = get(activeBlockchain)
    const nativeSession = get(activeSession)

    try {
        evmSession = await EvmSession.from({
            chainName: blockchain.id,
            nativeAccountName: nativeSession?.auth.actor,
        })
    } catch (e) {
        if (e.code === -32002) {
            await wait(5000)
            return startEvmSession()
        }

        if (!e.message) {
            connectingToEvm = false
            return
        }

        throw new Error(`Could not connect to EVM. Error: ${e.message}`)
    }

    if (evmSession) {
        activeEvmSession.set(evmSession)
        connectingToEvm = false
    }

    return evmSession
}

export function weiToAmount(wei: BigNumber, token: EvmToken) {
    return Asset.from(fromWei(wei, token.decimals), token.symbol)
}

export function fromWei(wei: BigNumber, decimals: number) {
    if (decimals === 18) {
        return Number(ethers.utils.formatEther(wei))
    } else {
        return wei.toNumber() / Math.pow(10, decimals);
    }
}
