import {derived, readable, writable} from 'svelte/store'
import type {ChainId} from 'anchor-link'
import {API, Asset} from '@greymass/eosio'
import {Resources, SampleUsage, PowerUpState, REXState} from '@greymass/eosio-resources'
import {activeBlockchain} from '~/store'

import {getClient} from '../../api-client'
import {active} from 'tinro'
import {compute_rest_props} from 'svelte/internal'

let chainId: ChainId
activeBlockchain.subscribe((value) => (chainId = value.chainId))

const getResourceClient = () => {
    const api = getClient(chainId)
    return new Resources({api})
}

// The AccountResponse representation of the sample account
export const sampleUsage = readable<SampleUsage | undefined>(undefined, (set) => {
    // Update on a set interval
    const interval = setInterval(
        async () =>
            getResourceClient()
                .getSampledUsage()
                .then((v) => set(v)),
        30000
    )

    // Subscribe to changes to the active blockchain and update on change
    const unsubscribe = activeBlockchain.subscribe(() =>
        getResourceClient()
            .getSampledUsage()
            .then((v) => set(v))
    )

    // Return callback w/ interval clear + unsubscribe
    return () => {
        unsubscribe()
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
    // Update on a set interval
    const interval = setInterval(() => getPowerUpState(set), 30000)

    // Subscribe to changes to the active blockchain and update on change
    const unsubscribe = activeBlockchain.subscribe(() => getPowerUpState(set))

    // Return callback w/ interval clear + unsubscribe
    return () => {
        unsubscribe()
        clearInterval(interval)
    }
})

// Rent 1ms of the networks CPU
export const msToRent = writable<number>(1)

export const powerupPrice = derived(
    [msToRent, sampleUsage, statePowerUp, info],
    ([$msToRent, $sampleUsage, $statePowerUp, $info]) => {
        if ($msToRent && $sampleUsage && $statePowerUp) {
            return Asset.from(
                $statePowerUp.cpu.price_per_ms($sampleUsage, $msToRent, $info),
                '4,EOS'
            )
        }
        return Asset.from(0, '4,EOS')
    }
)

export const stakingPrice = derived([msToRent, sampleUsage], ([$msToRent, $sampleUsage]) => {
    if ($msToRent && $sampleUsage) {
        const {account} = $sampleUsage
        const cpu_weight = Number(account.total_resources.cpu_weight.units)
        const cpu_limit = Number(account.cpu_limit.max.value)
        return Asset.fromUnits(cpu_weight / cpu_limit, '4,EOS')
    }
    return Asset.from(0, '4,EOS')
})

export const getREXState = async (set: (v: any) => void) =>
    set(await getResourceClient().v1.rex.get_state())

// The state of the REX system
export const stateREX = readable<REXState | undefined>(undefined, (set) => {
    // Update on a set interval
    const interval = setInterval(() => getREXState(set), 30000)

    // Subscribe to changes to the active blockchain and update on change
    const unsubscribe = activeBlockchain.subscribe(() => getREXState(set))

    // Return callback w/ interval clear + unsubscribe
    return () => {
        unsubscribe()
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
