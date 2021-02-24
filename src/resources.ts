import {AccountResponse, loadAccount} from '~/account-cache'
import {derived, readable} from 'svelte/store'
import type {ChainId} from 'anchor-link'
import {Name} from '@greymass/eosio'

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
    const interval = setInterval(() => getPowerUpState(set), 15000)
    return () => {
        clearInterval(interval)
    }
})

// The currently utilized capacity of PowerUp resources
export const powerupCapacity = derived(statePowerUp, ($statePowerUp) => {
    if ($statePowerUp) {
        const {adjusted_utilization, utilization, weight} = $statePowerUp.cpu
        return Math.max(Number(utilization), Number(adjusted_utilization)) / Number(weight)
    }
    return 0
})

// The amount of resources shifted away from REX/Staking into PowerUp
export const resourcesShifted = derived(statePowerUp, ($statePowerUp) => {
    if ($statePowerUp) {
        return (
            $statePowerUp.cpu.weight_ratio.toNumber() /
            $statePowerUp.cpu.target_weight_ratio.toNumber()
        )
    }
    return 0
})

// The price for 1ms of CPU in the PowerUp system
export const powerupPrice = derived(
    [statePowerUp, resourcesShifted],
    ([$statePowerUp, $resourcesShifted]) => {
        if ($statePowerUp && $resourcesShifted) {
            const {
                adjusted_utilization,
                exponent,
                max_price,
                min_price,
                utilization,
                weight,
            } = $statePowerUp.cpu

            const exp = Number(exponent)
            const min = Number(min_price.units)
            const max = Number(max_price.units)
            const coefficient = (max - min) / exp

            // Rent 1ms of the networks CPU
            const msToRent = 1

            // Milliseconds available per day available in PowerUp (factoring in shift)
            const mspdAvailable = mspd * (1 - $resourcesShifted / 100)
            const percentToRent = msToRent / mspdAvailable

            // PowerUp System utilization before rental
            const utilizationBefore =
                Math.max(Number(utilization), Number(adjusted_utilization)) / Number(weight)

            // PowerUp System utilization after rental
            const utilizationAfter = utilizationBefore + percentToRent

            // Estimated price of this rental from PowerUp
            const price =
                min * (utilizationAfter - utilizationBefore) +
                coefficient * (Math.pow(utilizationAfter, exp) - Math.pow(utilizationBefore, exp))

            // Divide by 10000 for 4,EOS precision
            return price / 10000
        }
        return 0
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
    const interval = setInterval(() => getREXState(set), 15000)
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

// The price for 1ms of CPU in the PowerUp system
export const rexPrice = derived(
    [sampledCpuCost, stateREX, resourcesShifted],
    ([$sampledCpuCost, $stateREX, $resourcesShifted]) => {
        if ($sampledCpuCost && $stateREX && $resourcesShifted) {
            const totalRent = $stateREX.total_rent
            const totalUnlent = $stateREX.total_unlent
            const tokens = 1
            const msPerToken =
                (tokens / (totalRent.value / totalUnlent.value)) *
                $sampledCpuCost *
                ($resourcesShifted / 100)
            return tokens / msPerToken
        }
        return 0
    }
)
