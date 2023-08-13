import {derived, writable} from 'svelte/store'
import type {Readable, Writable} from 'svelte/store'
import type {TinroRouteMeta} from 'tinro'

import {APIClient, PermissionLevel, TransactionHeader} from '@wharfkit/antelope'
import {
    AbiMap,
    PlaceholderName,
    PlaceholderPermission,
    ResolvedTransaction,
    SigningRequest,
} from '@wharfkit/signing-request'
import zlib from 'pako'

import {ChainConfig, chainConfig} from '~/config'
import {activeSession} from '~/store'
import {getClient} from '~/api-client'
import {ABICache} from '@wharfkit/session'

// The current route being passed in from the component
export let currentRoute = writable<TinroRouteMeta | undefined>(undefined)

// The current chain configuration derived from the current request
export let currentChain: Writable<ChainConfig | undefined> = writable(undefined)

// Storage for any errors we need to expose to the user
export const requestError: Writable<string | undefined> = writable(undefined)

// The currently loaded request, derived from the current route
export const currentRequest: Readable<SigningRequest | undefined> = derived(
    [currentRoute],
    ([$currentRoute]) => {
        if ($currentRoute) {
            const request = SigningRequest.from(`esr:${$currentRoute.params.payload}`, {
                zlib,
            })
            if (request.isMultiChain()) {
                const ids = request.getChainIds()
                if (ids) {
                    currentChain.set(chainConfig(ids[0]))
                }
            } else {
                currentChain.set(chainConfig(request.getChainId()))
            }
            return request
        }
    }
)

// The API client to fulfill the request
export let apiClient: Readable<APIClient | undefined> = derived(currentChain, ($currentChain) => {
    if ($currentChain) {
        return getClient($currentChain.chainId)
    }
})

// The ABI Provider derived from the API Client to resolve requests
export let abiProvider: Readable<ABICache | undefined> = derived(apiClient, ($apiClient) => {
    if ($apiClient) {
        return new ABICache($apiClient)
    }
})

// The ABIs required for the current request
export const abis: Readable<AbiMap | undefined> = derived(
    [abiProvider, currentRequest],
    ([$abiProvider, $currentRequest], set) => {
        if ($abiProvider && $currentRequest) {
            $currentRequest.fetchAbis($abiProvider).then((abis) => set(abis))
        }
    }
)

// The current transaction resolved from the current request
export const currentTransaction: Readable<ResolvedTransaction> = derived(
    [abis, activeSession, apiClient, currentRequest],
    ([$abis, $activeSession, $apiClient, $currentRequest], set) => {
        if ($abis && $apiClient && $currentRequest) {
            // Create a dummy permission level for resolution without an active session
            let auth: PermissionLevel = PermissionLevel.from({
                actor: PlaceholderName,
                permission: PlaceholderPermission,
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
