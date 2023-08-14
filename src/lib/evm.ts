import type {LinkSession} from 'anchor-link'
import {Asset, Name} from 'anchor-link'
import {ethers} from 'ethers'

import BN from 'bn.js'

import {Transfer} from '~/abi-types'

let provider: ethers.providers.Web3Provider

declare global {
    interface Window {
        ethereum: any
    }
}

interface EvmAccountParams {
    signer: ethers.providers.JsonRpcSigner
    address: string
}

export class EvmAccount {
    address: string
    signer: ethers.providers.JsonRpcSigner

    constructor({address, signer}: EvmAccountParams) {
        this.address = address
        this.signer = signer
    }

    static from(EvmAccountParams: EvmAccountParams) {
        // Implement your logic here
        return new EvmAccount(EvmAccountParams)
    }

    async sendTransaction(tx: ethers.providers.TransactionRequest) {
        return this.signer.sendTransaction(tx)
    }

    async getBalance() {
        const wei = await this.signer.getBalance()

        return formatEOS(ethers.utils.formatEther(wei))
    }
}

export function convertToEvmAddress(eosAccountName: string): string {
    const blockList = ['binancecleos', 'huobideposit', 'okbtothemoon']
    if (blockList.includes(eosAccountName)) {
        throw new Error('This CEX has not fully support the EOS-EVM bridge yet.')
    }
    return convertToEthAddress(eosAccountName)
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

interface TransferParams {
    amount: string
    evmAccount: EvmAccount
    nativeSession: LinkSession
}

export async function transferNativeToEvm({nativeSession, evmAccount, amount}: TransferParams) {
    const action = Transfer.from({
        from: nativeSession.auth.actor,
        to: 'eosio.evm',
        quantity: String(Asset.fromFloat(Number(amount), '4,EOS')),
        memo: evmAccount.address,
    })

    return nativeSession.transact({
        action: {
            authorization: [nativeSession.auth],
            account: Name.from('eosio.token'),
            name: Name.from('transfer'),
            data: action,
        },
    })
}

export async function estimateGas({nativeSession, evmAccount, amount}: TransferParams) {
    const targetEvmAddress = convertToEvmAddress(String(nativeSession.auth.actor))

    const gasPrice = await provider.getGasPrice()

    const gas = await provider.estimateGas({
        from: evmAccount.address,
        to: targetEvmAddress,
        value: ethers.utils.parseEther(amount),
        gasPrice,
        data: ethers.utils.formatBytes32String(''),
    })

    return {gas, gasPrice}
}

export async function getGasAmount({nativeSession, evmAccount, amount}: TransferParams): Promise<Asset> {
    const { gas, gasPrice } = await estimateGas({nativeSession, evmAccount, amount})

    const eosAmount = ethers.utils.formatEther(Number(gas) * Number(gasPrice))

    return Asset.fromFloat(Number(eosAmount), '4,EOS')
}

export async function transferEvmToNative({nativeSession, evmAccount, amount}: TransferParams) {
    const targetEvmAddress = convertToEvmAddress(String(nativeSession.auth.actor))

    const { gas } = await estimateGas({nativeSession, evmAccount, amount})

    return evmAccount.sendTransaction({
        from: evmAccount.address,
        to: targetEvmAddress,
        value: ethers.utils.parseEther(amount),
        gasPrice: await provider.getGasPrice(),
        gasLimit: gas,
        data: ethers.utils.formatBytes32String(''),
    })
}

async function switchNetwork() {
    await window.ethereum
        .request({
            method: 'wallet_switchEthereumChain',
            params: [{chainId: '0x4571'}],
        })
        .catch(async (e: {code: number}) => {
            if (e.code === 4902) {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                        {
                            chainId: '0x4571',
                            chainName: 'EOS EVM Network',
                            nativeCurrency: {name: 'EOS', symbol: 'EOS', decimals: 18},
                            rpcUrls: ['https://api.evm.eosnetwork.com/'],
                            blockExplorerUrls: ['https://explorer.evm.eosnetwork.com'],
                        },
                    ],
                })
            }
        })
}

export async function connectEthWallet(): Promise<EvmAccount> {
    if (window.ethereum) {
        provider = new ethers.providers.Web3Provider(window.ethereum)
        let networkId = await provider.getNetwork()
        if (networkId.chainId !== 17777) {
            await switchNetwork()
            networkId = await provider.getNetwork()
        }

        await window.ethereum.request({method: 'eth_requestAccounts'})
        const signer = provider.getSigner()

        await window.ethereum.get_currency_balance

        return EvmAccount.from({
            address: await signer.getAddress(),
            signer,
        })
    } else {
        throw 'You need to install Metamask in order to use this feature.'
    }
}

function formatEOS(amount: String) {
    return `${Number(amount).toFixed(4)} EOS`
}
