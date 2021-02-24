import {AccountResponse, loadAccount} from '~/account-cache'
import {derived, readable, writable} from 'svelte/store'
import type {ChainId} from 'anchor-link'
import {Asset, Name} from '@greymass/eosio'

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
// resources shifted to powerup
let shifted: number = 0
export let resourcesShifted = writable<number>(0)
resourcesShifted.subscribe((value) => (shifted = value))

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

// The price for 1ms of CPU from the PowerUp system
export const powerupPrice = readable(0, (set) => {
    // Set value upon initial load
    getPowerupPrice(chainId).then((price) => set(price))
    // Set interval to reload the price every 15 seconds
    const interval = setInterval(async () => {
        set(await getPowerupPrice(chainId))
    }, 15000)
    // Return the stop function to clear the interval
    return () => {
        clearInterval(interval)
    }
})

export async function getPowerupPrice(chainId: ChainId): Promise<number> {
    const results = await getClient(chainId).v1.chain.get_table_rows({
        code: 'eosio',
        scope: '',
        table: 'powup.state',
    })
    console.log(results.rows[0].cpu)
    if (results.rows && results.rows.length) {
        const [row] = results.rows
        const {
            adjusted_utilization,
            exponent,
            max_price,
            min_price,
            target_weight_ratio,
            utilization,
            weight,
            weight_ratio,
        } = row.cpu

        // Update the store with the amount of resources remaining in the legacy system
        resourcesShifted.set(weight_ratio / target_weight_ratio)
        console.log('shifted', shifted)

        // Rent 1ms of the networks CPU
        const msToRent = 1

        // exp = 2
        const exp = Number(exponent)
        console.log('exp', exp)

        // min = 25000000
        const min = Asset.from(min_price).units.toNumber()
        console.log('min', min)

        // max = 750000000
        const max = Asset.from(max_price).units.toNumber()
        console.log('max', max)

        // coefficient = 362500000
        const coefficient = (max - min) / exp
        console.log('coefficient', coefficient)

        console.log('utilization', utilization)
        console.log('weight', weight)

        // Milliseconds available per day available in PowerUp
        // mspd = 34560000
        // shifted = 0.010015341213459587
        // mspdAvailable = 346130.1923371633
        const mspdAvailable = mspd * (1 - shifted / 100)
        console.log('mspd', mspd)
        console.log('mspdAvailable', mspdAvailable)

        // msToRent = 1
        // mspdAvailable = 346130.1923371633
        // toRent = 0.000002889086309540735
        const toRent = msToRent / mspdAvailable
        console.log('toRent', toRent)

        // Current network utilization
        // utilizationBefore = 0.0005025088826527105
        const utilizationBefore = Math.max(utilization, adjusted_utilization) / Number(weight)
        console.log('utilizationBefore', utilizationBefore)

        // Utilization after this rental
        // utilizationAfter = 0.0005053979689622512
        const utilizationAfter = utilizationBefore + toRent
        console.log('utilizationAfterr', utilizationAfter)

        // Price of Rental
        // price = 73.2827323222997
        const price =
            min * (utilizationAfter - utilizationBefore) +
            coefficient *
                (Math.pow(utilizationAfter, exponent) - Math.pow(utilizationBefore, exponent))

        /**
         * price = 25000000 * (0.0005053979689622512 - 0.0005025088826527105) + 362500000 * ((0.0005053979689622512 ^ 2) - (0.0005025088826527105 ^ 2))
         *
         * ---
         *
         *  25000000 * (0.0005053979689622512 - 0.0005025088826527105) +
         *  362500000 *
         *      ((0.0005053979689622512 ^ 2) - (0.0005025088826527105 ^ 2))
         */

        console.log('price', price)

        // Price in Asset format
        // price = 0.00732827 EOS

        /* 
            weight / (
                min_price + (
                    max_price - min_price
                ) * (
                    max(utilization, adjusted_utilization) / weight
                )
                ^ (
                    exponent - 1
                )
            )
        */

        // Divide by 10000 for
        return price / 10000
    }
    return 0
}

// The price for 1ms of CPU from the REX system
export const rexPrice = readable(0, (set) => {
    // Set value upon initial load
    getRexPrice(chainId).then((price) => set(price))
    // Set interval to reload the price every 15 seconds
    const interval = setInterval(async () => {
        set(await getRexPrice(chainId))
    }, 15000)
    // Return the stop function to clear the interval
    return () => {
        clearInterval(interval)
    }
})

export async function getRexPrice(chainId: ChainId): Promise<number> {
    const results = await getClient(chainId).v1.chain.get_table_rows({
        code: 'eosio',
        scope: 'eosio',
        table: 'rexpool',
    })
    if (results.rows) {
        const [row] = results.rows
        const totalRent = Asset.from(row.total_rent)
        const totalUnlent = Asset.from(row.total_unlent)
        const tokens = 1
        const msPerToken = (tokens / (totalRent.value / totalUnlent.value)) * internalSampledCpuCost
        return tokens / msPerToken
    }
    return 0
}
