import {derived, readable, writable} from 'svelte/store'
import type {ChainId} from 'anchor-link'
import {API, Asset} from '@greymass/eosio'
import {Resources, SampleUsage, PowerUpState, REXState} from '@greymass/eosio-resources'
import {activeBlockchain} from '~/store'

import {getClient} from '../../api-client'

let chainId: ChainId
activeBlockchain.subscribe((value) => (chainId = value.chainId))

const getResourceClient = () => {
    const api = getClient(chainId)
    return new Resources({api})
}

// The AccountResponse representation of the sample account
export const sampleUsage = readable<SampleUsage | undefined>(undefined, (set) => {
    getResourceClient()
        .getSampledUsage()
        .then((v) => set(v))

    const interval = setInterval(
        async () =>
            getResourceClient()
                .getSampledUsage()
                .then((v) => set(v)),
        30000
    )

    return () => {
        clearInterval(interval)
    }
})

export const getInfo = async (set: (v: any) => void) =>
    set(await getClient(chainId).v1.chain.get_info())

export const info = readable<API.v1.GetInfoResponse | undefined>(undefined, (set) => {
    getInfo(set)
})

export const getPowerUpState = async (set: (v: any) => void) =>
    set(await getResourceClient().v1.powerup.get_state())

// The state of the PowerUp system
export const statePowerUp = readable<PowerUpState | undefined>(undefined, (set) => {
    getPowerUpState(set)
    const interval = setInterval(() => getPowerUpState(set), 30000)
    return () => {
        clearInterval(interval)
    }
})

// Rent 1ms of the networks CPU
export const msToRent = writable<number>(1)

export const powerupPrice = derived(
    [msToRent, statePowerUp, info],
    ([$msToRent, $statePowerUp, $info]) => {
        if ($msToRent && $statePowerUp) {
            return Asset.from($statePowerUp.cpu.price_per_ms($msToRent, $info), '4,EOS')
        }
        return Asset.from(0, '4,EOS')
    }
)

export const getREXState = async (set: (v: any) => void) =>
    set(await getResourceClient().v1.rex.get_state())

// The state of the REX system
export const stateREX = readable<REXState | undefined>(undefined, (set) => {
    getREXState(set)
    const interval = setInterval(() => getREXState(set), 30000)
    return () => {
        clearInterval(interval)
    }
})

// The price of CPU in the REX system
export const rexPrice = derived(
    [msToRent, sampleUsage, stateREX],
    ([$msToRent, $sampleUsage, $stateREX]) => {
        if ($msToRent && $sampleUsage && $stateREX) {
            return Asset.from($stateREX.price_per_ms($sampleUsage, $msToRent), '4,EOS')
        }
        return Asset.from(0, '4,EOS')
    }
)
