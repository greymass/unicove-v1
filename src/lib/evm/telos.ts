import { apiClient } from "~/pages/request/request"
import { Asset, Name, NameType } from "anchor-link"
import { get } from "svelte/store"
import { BN } from "bn.js"
import { activeBlockchain, waitForStoreValue } from "~/store"
import { getClient } from "~/api-client"

export interface EvmSessionFromParams {
    nativeAccountName: NameType
}

export interface EvmSessionParams {
    nativeAccountName: NameType
    address?: string
}

const CHAIN_CONFIG = {
    chainId: '0x4571',
    chainName: 'EOS EVM Network',
    nativeCurrency: {name: 'TLOS', symbol: '4,TLOS'},
    rpcUrls: ['https://api.evm.eosnetwork.com/'],
    blockExplorerUrls: ['https://explorer.evm.eosnetwork.com'],
}

export class EvmSession {
    address?: string
    nativeAccountName: NameType

    constructor({nativeAccountName, address}: EvmSessionParams) {
        this.nativeAccountName = nativeAccountName
        this.address = address
    }

    get chainConfig() {
        return CHAIN_CONFIG
    }

    static async from({ nativeAccountName }: EvmSessionFromParams) {
        const account = await getAccount(nativeAccountName)
        const address = account ? `0x${account.address}` : undefined
        return new EvmSession({
            address,
            nativeAccountName,
        })
    }

    async getBalance() {
        const account = await getAccount(this.nativeAccountName)

        if (!account) {
            return Asset.from(0, this.chainConfig.nativeCurrency.symbol)
        }

        const bnBalance = new BN(account.balance, 16)

        return Asset.from(Number(bnBalance), this.chainConfig.nativeCurrency.symbol)
    }
}

async function getAccount(nativeAccountName: NameType) {
    const chain = get(activeBlockchain)
    const client = getClient(chain.chainId)

    if (!client) {
        throw new Error('API client could not be instantiated')
    }

    const { rows } = await client.v1.chain.get_table_rows({
        code: 'eosio.evm',
        scope: 'eosio.evm',
        table: 'account',
        lower_bound: Name.from(nativeAccountName),
        upper_bound: Name.from(nativeAccountName),
    })

    return rows[0]
}