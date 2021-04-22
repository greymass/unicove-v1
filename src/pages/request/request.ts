import {derived, writable} from 'svelte/store'
import type {Readable} from 'svelte/store'
import {AbiMap, SigningRequest} from 'eosio-signing-request'
import {
    ABIDef,
    AnyAction,
    API,
    APIClient,
    ChainId,
    LinkChain,
    PermissionLevel,
    Transaction,
    TransactionHeader,
} from 'anchor-link'
import type {TinroRouteMeta} from 'tinro'
import {ChainConfig, chainConfig} from '~/config'
import {activeBlockchain, activeSession} from '~/store'

import zlib from 'pako'
import {getClient} from '~/api-client'

let chainId: ChainId
activeBlockchain.subscribe((value) => (chainId = value.chainId))

export let currentRoute = writable<TinroRouteMeta | undefined>(undefined)

let linkChain: LinkChain
activeSession.subscribe(async (session) => {
    if (session) {
        linkChain = session.link.getChain(chainId)
    }
})

let apiClient: APIClient = getClient(
    ChainId.from('aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906')
)

const abiProvider = {
    getAbi: async (account: any) => {
        if (linkChain) {
            return linkChain.getAbi(account)
        }
        return (await apiClient.v1.chain.get_abi(account)).abi as ABIDef
    },
}

export const currentRequest: Readable<SigningRequest | undefined> = derived(
    currentRoute,
    ($currentRoute) => {
        if ($currentRoute) {
            return SigningRequest.from(`esr:${$currentRoute.params.payload}`, {
                abiProvider,
                zlib,
            })
        }
    }
)

export const abis: Readable<AbiMap | undefined> = derived(
    currentRequest,
    ($currentRequest, set) => {
        if ($currentRequest) {
            $currentRequest.fetchAbis().then((abis) => set(abis))
        }
    }
)

export let currentChain: Readable<ChainConfig | undefined> = derived(
    currentRequest,
    ($currentRequest) => {
        if ($currentRequest) {
            return chainConfig($currentRequest.getChainId())
        }
    }
)

export let multichain: Readable<boolean> = derived(currentRequest, ($currentRequest) => {
    if ($currentRequest) {
        return $currentRequest.isMultiChain()
    }
    return false
})

export const resolveTransaction = async (
    set: (v: any) => void,
    abis: any,
    auth: any,
    request: any
) => {
    const info: API.v1.GetInfoResponse = await apiClient.v1.chain.get_info()
    const header: TransactionHeader = info.getTransactionHeader()
    set(request.resolveTransaction(await abis, auth, header))
}

export const currentTransaction: Readable<Transaction> = derived(
    [abis, activeBlockchain, activeSession, currentRequest],
    ([$abis, $activeBlockchain, $activeSession, $currentRequest], set) => {
        if ($abis && $activeBlockchain && $currentRequest) {
            // Create a dummy permission level for resolution without an active session
            let auth: PermissionLevel = PermissionLevel.from({
                actor: 'test',
                permission: 'active',
            })
            // If an active session exists, use it instead
            if ($activeSession) {
                auth = $activeSession.auth
            }
            // Resolve the transaction for the interface to display
            resolveTransaction(set, $abis, auth, $currentRequest)
        }
        return undefined
    }
)

const templates = [
    {
        name: 'newaccount',
        actions: ['eosio::newaccount', 'eosio::buyrambytes'],
    },
]

export const currentTemplate: Readable<string> = derived(
    currentTransaction,
    ($currentTransaction: any) => {
        if ($currentTransaction) {
            const actions = $currentTransaction.actions.map(
                (action: AnyAction) => `${action.account}::${action.name}`
            )
            const matching = templates.find(
                (template) => JSON.stringify(template.actions) === JSON.stringify(actions)
            )
            if (matching) {
                return matching.name
            }
        }
        return 'default'
    }
)
