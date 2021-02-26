import {AccountResponse, loadAccount} from '~/account-cache'
import {derived, readable, writable} from 'svelte/store'
import type {ChainId} from 'anchor-link'
import {Asset, Name} from '@greymass/eosio'

import {PowerUpState, REXState} from '~/abi-types'
import {activeBlockchain} from '~/store'

import {getClient} from './api-client'

let chainId: ChainId
activeBlockchain.subscribe((value) => (chainId = value.chainId))

// ms per block
export const mspb = 200
// blocks per second
export const bps = 2
// blocks per day
export const bpd = bps * 60 * 60 * 24
// ms per day
export const mspd = mspb * bpd
// An active account on the network to use for usage sampling purposes
export const sampleAccountName: Name = Name.from('teamgreymass')

// The AccountResponse representation of the sample account
export const sampleAccountResponse = readable<AccountResponse>({stale: true}, (set) => {
    loadAccount(sampleAccountName, chainId, (v) => set(v))

    const interval = setInterval(
        async () => loadAccount(sampleAccountName, chainId, (v) => set(v)),
        1000
    )

    return () => {
        clearInterval(interval)
    }
})

// The derived value of CPU Costs (in milliseconds) from the sample account
export const sampledCpuCost = derived(sampleAccountResponse, ($sampleAccountResponse) => {
    if ($sampleAccountResponse.account) {
        return (
            $sampleAccountResponse.account.cpu_limit.max.value /
            $sampleAccountResponse.account.total_resources.cpu_weight.value /
            1000
        )
    }
    return 0
})

// The derived value of NET Costs (in bytes) from the sample account
export const sampledNetCost = derived(sampleAccountResponse, ($sampleAccountResponse) => {
    if ($sampleAccountResponse.account) {
        return (
            $sampleAccountResponse.account.net_limit.max.value /
            $sampleAccountResponse.account.total_resources.net_weight.value
        )
    }
    return 0
})

export const getPowerUpState = (set: (v: any) => void) =>
    getClient(chainId)
        .v1.chain.get_table_rows({
            code: 'eosio',
            scope: '',
            table: 'powup.state',
            type: PowerUpState,
        })
        .then((results) => set(results.rows[0]))

// The state of the PowerUp system
export const statePowerUp = readable<PowerUpState | undefined>(undefined, (set) => {
    getPowerUpState(set)
    const interval = setInterval(() => getPowerUpState(set), 30000)
    return () => {
        clearInterval(interval)
    }
})

// The currently utilized capacity of PowerUp resources
export const powerupCapacity = derived(statePowerUp, ($statePowerUp) => {
    if ($statePowerUp) {
        const {utilization, weight} = $statePowerUp.cpu
        return Number(utilization) / Number(weight)
    }
    return 0
})

// The target weight for REX in the end of the transition (10^13 = 1% REX)
export const resourcesShiftedREXTarget = Math.pow(10, 13)

// The amount of resources shifted away from REX/Staking into PowerUp
export const resourcesShifted = derived(statePowerUp, ($statePowerUp) => {
    if ($statePowerUp) {
        return $statePowerUp.cpu.weight_ratio.toNumber() / resourcesShiftedREXTarget
    }
    return 0
})

// Rent 1ms of the networks CPU
export const msToRent = writable<number>(1)

export const powerupPrice2 = derived(
    [msToRent, statePowerUp, resourcesShifted],
    ([$msToRent, $statePowerUp, $resourcesShifted]) => {
        if ($msToRent && $statePowerUp && $resourcesShifted) {
            // Casting EOSIO types to usable formats for JS calculations
            let adjusted_utilization: number = Number($statePowerUp.cpu.adjusted_utilization)
            const decay_secs: number = Number($statePowerUp.cpu.decay_secs.value)
            const exponent: number = Number($statePowerUp.cpu.exponent)
            const max_price: number = $statePowerUp.cpu.max_price.value
            const min_price: number = $statePowerUp.cpu.min_price.value
            const utilization: number = Number($statePowerUp.cpu.utilization)
            const utilization_timestamp: number = Number(
                $statePowerUp.cpu.utilization_timestamp.value
            )
            const weight: number = Number($statePowerUp.cpu.weight)

            // Milliseconds available per day available in PowerUp (factoring in shift)
            const mspdAvailable = mspd * (1 - $resourcesShifted / 100)

            // Percentage to rent
            const percentToRent = $msToRent / mspdAvailable
            const utilization_increase = weight * percentToRent

            // If utilization is less than adjusted, calculate real time value
            if (utilization < adjusted_utilization) {
                // Create now & adjust JS timestamp to match EOSIO timestamp values
                const now: number = Math.floor(Date.now() / 1000)
                const diff: number = adjusted_utilization - utilization
                let delta: number = Math.floor(
                    diff * Math.exp(-(now - utilization_timestamp) / decay_secs)
                )
                delta = Math.min(Math.max(delta, 0), diff) // Clamp the delta
                adjusted_utilization = utilization + delta
            }

            const price_integral_delta = (
                start_utilization: number,
                end_utilization: number
            ): number => {
                const coefficient = (max_price - min_price) / exponent
                const start_u = start_utilization / weight
                const end_u = end_utilization / weight
                return (
                    min_price * end_u -
                    min_price * start_u +
                    coefficient * Math.pow(end_u, exponent) -
                    coefficient * Math.pow(start_u, exponent)
                )
            }

            const price_function = (utilization: number): number => {
                let price = min_price
                const new_exponent = exponent - 1.0
                if (new_exponent <= 0.0) {
                    return max_price
                } else {
                    price += (max_price - min_price) * Math.pow(utilization / weight, new_exponent)
                }
                return price
            }

            let fee: number = 0.0
            let start_utilization: number = utilization
            const end_utilization: number = start_utilization + utilization_increase

            if (start_utilization < adjusted_utilization) {
                fee +=
                    (price_function(adjusted_utilization) *
                        Math.min(utilization_increase, adjusted_utilization - start_utilization)) /
                    weight
                start_utilization = adjusted_utilization
            }

            if (start_utilization < end_utilization) {
                fee += price_integral_delta(start_utilization, end_utilization)
            }

            // Return the fee as an Asset
            return Asset.fromUnits(Math.ceil(fee * 10000), '4,EOS')
        }
        return Asset.from(0, '4,EOS')
    }
)

// The price for 1ms of CPU in the PowerUp system
export const powerupPrice = derived(
    [msToRent, statePowerUp, resourcesShifted],
    ([$msToRent, $statePowerUp, $resourcesShifted]) => {
        if ($statePowerUp && $resourcesShifted) {
            const {
                adjusted_utilization,
                decay_secs,
                exponent,
                max_price,
                min_price,
                utilization,
                utilization_timestamp,
                weight,
            } = $statePowerUp.cpu

            const exp = Number(exponent)
            const min = Number(min_price.units)
            const max = Number(max_price.units)
            const coefficient = (max - min) / exp

            // Milliseconds available per day available in PowerUp (factoring in shift)
            const mspdAvailable = mspd * (1 - $resourcesShifted / 100)
            const percentToRent = $msToRent / mspdAvailable

            // PowerUp System utilization before rental executes
            let utilizationBefore =
                Math.max(Number(utilization), Number(adjusted_utilization)) / Number(weight)

            // If utilization is less than adjusted, calculate real time value
            if (Number(utilization) < Number(adjusted_utilization)) {
                const utilizationDiff = Number(adjusted_utilization) - Number(utilization)
                const now: number = Date.now() / 1000 // Adjust JS timestamp to match EOSIO timestamp values
                const then: number = Number(utilization_timestamp.value)
                const decay: number = Number(decay_secs.value)
                let utilizationDelta = utilizationDiff * Math.exp(-(now - then) / decay)
                utilizationDelta = Math.min(Math.max(utilizationDelta, 0), utilizationDiff) // Clamp the delta
                utilizationBefore = (Number(utilization) + utilizationDelta) / Number(weight)
            }

            // PowerUp System utilization after rental
            const utilizationAfter = utilizationBefore + percentToRent

            // Estimated price of this rental from PowerUp
            const price =
                min * (utilizationAfter - utilizationBefore) +
                coefficient * (Math.pow(utilizationAfter, exp) - Math.pow(utilizationBefore, exp))

            // Return the ceil of the price as an asset
            return Asset.fromUnits(Math.ceil(price), '4,EOS')
        }
        return Asset.fromUnits(0, '4,EOS')
    }
)

export const getREXState = (set: (v: any) => void) =>
    getClient(chainId)
        .v1.chain.get_table_rows({
            code: 'eosio',
            scope: 'eosio',
            table: 'rexpool',
            type: REXState,
        })
        .then((results) => set(results.rows[0]))

// The state of the REX system
export const stateREX = readable<REXState | undefined>(undefined, (set) => {
    getREXState(set)
    const interval = setInterval(() => getREXState(set), 30000)
    return () => {
        clearInterval(interval)
    }
})

// The currently utilized capacity of REX resources
export const rexCapacity = derived(stateREX, ($stateREX) => {
    if ($stateREX) {
        return Number($stateREX.total_lent.units) / Number($stateREX.total_lendable.units)
    }
    return 0
})

// The price for 1ms of CPU in the REX system
export const rexPrice = derived(
    [msToRent, sampledCpuCost, stateREX, resourcesShifted],
    ([$msToRent, $sampledCpuCost, $stateREX, $resourcesShifted]) => {
        if ($msToRent && $sampledCpuCost && $stateREX && $resourcesShifted) {
            const totalRent = $stateREX.total_rent
            const totalUnlent = $stateREX.total_unlent
            const tokens = 1
            const msPerToken =
                (tokens / (totalRent.value / totalUnlent.value)) *
                $sampledCpuCost *
                ($resourcesShifted / 100)
            return (tokens / msPerToken) * $msToRent
        }
        return 0
    }
)
