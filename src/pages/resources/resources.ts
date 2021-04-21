import {derived, readable, writable} from 'svelte/store'
import type {ChainId} from 'anchor-link'
import {API, Asset} from '@greymass/eosio'
import {Resources, SampleUsage, PowerUpState, RAMState, REXState} from '@greymass/eosio-resources'
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
    // Update on a set interval
    const interval = setInterval(
        () =>
            getResourceClient()
                .getSampledUsage()
                .then((v) => set(v))
                .catch((e) => {
                    // TODO: We should probably have some sort of error catcher for stuff like this?
                    console.error(e)
                    // Set to undefined, which is the same as uninitialized
                    set(undefined)
                }),
        30000
    )

    // Subscribe to changes to the active blockchain and update on change
    const unsubscribe = activeBlockchain.subscribe(() =>
        getResourceClient()
            .getSampledUsage()
            .then((v) => set(v))
            .catch((e) => {
                // TODO: We should probably have some sort of error catcher for stuff like this?
                console.error(e)
                // Set to undefined, which is the same as uninitialized
                set(undefined)
            })
    )

    // Return callback w/ interval clear + unsubscribe
    return () => {
        unsubscribe()
        clearInterval(interval)
    }
})

export const getInfo = async (set: (v: any) => void) =>
    getClient(chainId)
        .v1.chain.get_info()
        .then((result) => set(result))
        .catch((e) => {
            // TODO: We should probably have some sort of error catcher for stuff like this?
            console.error(e)
            // Set to undefined, which is the same as uninitialized
            set(undefined)
        })

export const info = readable<API.v1.GetInfoResponse | undefined>(undefined, (set) => {
    getInfo(set)
})

export const getPowerUpState = async (set: (v: any) => void) =>
    getResourceClient()
        .v1.powerup.get_state()
        .then((result) => set(result))
        .catch((e) => {
            // TODO: We should probably have some sort of error catcher for stuff like this?
            console.error(e)
            // Set to undefined, which is the same as uninitialized
            set(undefined)
        })

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
    getResourceClient()
        .v1.rex.get_state()
        .then((result) => set(result))
        .catch((e) => {
            // TODO: We should probably have some sort of error catcher for stuff like this?
            console.error(e)
            // Set to undefined, which is the same as uninitialized
            set(undefined)
        })

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
            return Asset.from($stateREX.price_per($sampleUsage, $msToRent * 1000), '4,EOS')
        }
        return Asset.from(0, '4,EOS')
    }
)

// The state of the REX system
export const stateRAM = readable<RAMState | undefined>(undefined, (set) => {
    // Update on a set interval
    const interval = setInterval(() => getRAMState(set), 30000)

    // Subscribe to changes to the active blockchain and update on change
    const unsubscribe = activeBlockchain.subscribe(() => getRAMState(set))

    // Return callback w/ interval clear + unsubscribe
    return () => {
        unsubscribe()
        clearInterval(interval)
    }
})

export const getRAMState = async (set: (v: any) => void) =>
    getResourceClient()
        .v1.ram.get_state()
        .then((result) => set(result))
        .catch((e) => {
            // TODO: We should probably have some sort of error catcher for stuff like this?
            console.error(e)
            // Set to undefined, which is the same as uninitialized
            set(undefined)
        })
