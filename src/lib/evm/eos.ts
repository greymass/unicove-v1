import type {LinkSession} from 'anchor-link'
import {Asset, Name} from 'anchor-link'
import {ethers} from 'ethers'

import BN from 'bn.js'

import {Transfer} from '~/abi-types'
import {getClient} from '~/api-client'
import { TransferParams, convertToEvmAddress, estimateGas, getProvider } from '../evm'

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

export async function getNativeTransferFee({
    nativeSession,
}: {
    nativeSession: LinkSession
}): Promise<Asset> {
    const apiClient = getClient(nativeSession.chainId)

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

    console.log({apiResponse})

    const config = apiResponse.rows[0]

    console.log({config})

    return Asset.from(config.ingress_bridge_fee || '0.0000 EOS')
}

export async function getGasAmount({
    nativeSession,
    evmAccount,
    amount,
}: TransferParams): Promise<Asset> {
    const {gas, gasPrice} = await estimateGas({nativeSession, evmAccount, amount})

    const eosAmount = ethers.utils.formatEther(Number(gas) * Number(gasPrice))

    return Asset.fromFloat(Number(eosAmount), evmAccount.chainConfig.nativeCurrency.symbol)
}

export async function transferEvmToNative({nativeSession, evmAccount, amount}: TransferParams) {
    const targetEvmAddress = convertToEvmAddress(String(nativeSession.auth.actor))

    const {gas} = await estimateGas({nativeSession, evmAccount, amount})

    return evmAccount.sendTransaction({
        from: evmAccount.address,
        to: targetEvmAddress,
        value: ethers.utils.parseEther(amount),
        gasPrice: await getProvider().getGasPrice(),
        gasLimit: gas,
        data: ethers.utils.formatBytes32String(''),
    })
}
