import {derived} from 'svelte/store'
import type {Readable} from 'svelte/store'

import {Resources, RAMState} from '@greymass/eosio-resources'

import {apiClient} from './request'

export let resourceClient: Readable<Resources | undefined> = derived(apiClient, ($apiClient) => {
    if ($apiClient) {
        return new Resources({api: $apiClient})
    }
})

export const stateRAM: Readable<RAMState | undefined> = derived(
    [resourceClient],
    ([$resourceClient], set) => {
        if ($resourceClient) {
            $resourceClient.v1.ram
                .get_state()
                .then((result) => set(result))
                .catch((e) => {
                    // TODO: We should probably have some sort of error catcher for stuff like this?
                    console.error(e)
                    // Set to undefined, which is the same as uninitialized
                    set(undefined)
                })
        }
    }
)
