import {derived, writable} from 'svelte/store'
import type {Readable} from 'svelte/store'
import {AbiMap, SigningRequest} from 'eosio-signing-request'
import type {AnyAction, API, ChainId, LinkChain, Transaction, TransactionHeader} from 'anchor-link'
import type {TinroRouteMeta} from 'tinro'
import {ChainConfig, chainConfig} from '~/config'
import {activeBlockchain, activeSession} from '~/store'

import zlib from 'pako'

let chainId: ChainId
activeBlockchain.subscribe((value) => (chainId = value.chainId))

export let currentRoute = writable<TinroRouteMeta | undefined>(undefined)

export const currentRequest: Readable<SigningRequest | undefined> = derived(
    currentRoute,
    ($currentRoute) => {
        if ($currentRoute) {
            return SigningRequest.from(`esr:${$currentRoute.params.payload}`, {
                abiProvider: linkChain,
                zlib,
            })
        }
    }
)

let linkChain: LinkChain
activeSession.subscribe(async (session) => {
    if (session) {
        linkChain = session.link.getChain(chainId)
    }
})

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
    session: any,
    request: any
) => {
    const info: API.v1.GetInfoResponse = await session.client.v1.chain.get_info()
    const header: TransactionHeader = info.getTransactionHeader()
    set(request.resolveTransaction(await abis, session.auth, header))
}

export const currentTransaction: Readable<Transaction> = derived(
    [abis, activeSession, activeBlockchain, currentRequest],
    ([$abis, $activeSession, $activeBlockchain, $currentRequest], set) => {
        if ($abis && $activeSession && $activeBlockchain && $currentRequest) {
            resolveTransaction(set, $abis, $activeSession, $currentRequest)
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

export const currentTemplate: Readable<string | undefined> = derived(
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
            return 'default'
        }
    }
)
