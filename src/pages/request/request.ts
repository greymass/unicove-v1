import {derived, writable} from 'svelte/store'
import type {Readable, Writable} from 'svelte/store'
import type {TinroRouteMeta} from 'tinro'

import {ABIDef, APIClient, PermissionLevel, TransactionHeader} from '@greymass/eosio'
import {AbiMap, ResolvedTransaction, SigningRequest} from 'eosio-signing-request'

import {ChainConfig, chainConfig} from '~/config'
import {activeSession} from '~/store'

import zlib from 'pako'
import {getClient} from '~/api-client'

// The current route being passed in from the component
export let currentRoute = writable<TinroRouteMeta | undefined>(undefined)

// The chain configuration that matches the current request
export let currentChain: Writable<ChainConfig | undefined> = writable(undefined)
let currentChainConfig: ChainConfig | undefined
currentChain.subscribe((value) => (currentChainConfig = value))

// The API client to fulfill the request
export let apiClient: Readable<APIClient | undefined> = derived(currentChain, ($currentChain) => {
    if ($currentChain) {
        return getClient($currentChain.chainId)
    }
})

// The ABI Provider derived from the API Client to resolve requests
export let abiProvider: Readable<any> = derived(apiClient, ($apiClient) => {
    if ($apiClient) {
        return {
            getAbi: async (account: any) => {
                return (await $apiClient.v1.chain.get_abi(account)).abi as ABIDef
            },
        }
    }
})

// The currently loaded request, derived from the current route
export const currentRequest: Readable<SigningRequest | undefined> = derived(
    currentRoute,
    ($currentRoute) => {
        if ($currentRoute) {
            return SigningRequest.from(`esr:${$currentRoute.params.payload}`, {
                zlib,
            })
        }
    }
)

// Set the current chain based on the current request
currentRequest.subscribe((request) => {
    if (request) {
        const id = request.getChainId()
        if (!currentChainConfig || !currentChainConfig.chainId.equals(id)) {
            currentChain.set(chainConfig(id))
        }
    }
})

// The ABIs required for the current request
export const abis: Readable<AbiMap | undefined> = derived(
    [abiProvider, currentRequest],
    ([$abiProvider, $currentRequest], set) => {
        if ($currentRequest && currentChainConfig) {
            $currentRequest.fetchAbis($abiProvider).then((abis) => set(abis))
        }
    }
)

// Whether or not this is a multichain request
export const multichain: Readable<boolean> = derived(currentRequest, ($currentRequest) => {
    if ($currentRequest) {
        return $currentRequest.isMultiChain()
    }
    return false
})

// The current transaction resolved from the current request
export const currentTransaction: Readable<ResolvedTransaction> = derived(
    [abis, activeSession, apiClient, currentRequest],
    ([$abis, $activeSession, $apiClient, $currentRequest], set) => {
        if ($apiClient && $abis && $currentRequest) {
            // Create a dummy permission level for resolution without an active session
            let auth: PermissionLevel = PermissionLevel.from({
                actor: 'test',
                permission: 'active',
            })
            // If an active session exists, use it instead
            if ($activeSession) {
                auth = $activeSession.permissionLevel
            }
            // Resolve the transaction for the interface to display
            $apiClient.v1.chain.get_info().then((info: any) => {
                const header: TransactionHeader = info.getTransactionHeader()
                set($currentRequest.resolveTransaction($abis, auth, header))
            })
        }
        return undefined
    }
)
