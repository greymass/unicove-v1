import { derived, Readable } from 'svelte/store'
import { Int64, API, Asset } from '@greymass/eosio'
import { Resources, SampleUsage, PowerUpState, RAMState, REXState } from '@greymass/eosio-resources'
import { activeBlockchain } from '~/store'
import { BNPrecision } from '@greymass/eosio-resources'

import { getClient } from '../../api-client'
import { ChainConfig, ChainFeatures, resourceFeatures } from '~/config'

const getResourceClient = (chain: ChainConfig) => {
    const api = getClient(chain)
    const options: any = { api }
    if (chain.resourceSampleAccount) {
        options.sampleAccount = chain.resourceSampleAccount
    }
    return new Resources(options)
}

export const getSampleUsage = async (set: (v: any) => void, chain: ChainConfig) =>
    getResourceClient(chain)
        .getSampledUsage()
        .then((v) => set(v))
        .catch((e) => {
            // TODO: We should probably have some sort of error catcher for stuff like this?
            console.error(e)
            // Set to undefined, which is the same as uninitialized
            set(undefined)
        })

// The AccountResponse representation of the sample account
export const sampleUsage: Readable<SampleUsage | undefined> = derived(
    [activeBlockchain],
    ([$activeBlockchain], set) => {
        if (
            $activeBlockchain &&
            Array.from($activeBlockchain.chainFeatures).some((r) => resourceFeatures.includes(r))
        ) {
            getSampleUsage(set, $activeBlockchain)
            const interval = setInterval(() => getSampleUsage(set, $activeBlockchain), 30000)
            return () => {
                clearInterval(interval)
            }
        }
    }
)

export const getInfo = async (set: (v: any) => void, chain: ChainConfig) =>
    getClient(chain)
        .v1.chain.get_info()
        .then((result) => set(result))
        .catch((e) => {
            // TODO: We should probably have some sort of error catcher for stuff like this?
            console.error(e)
            // Set to undefined, which is the same as uninitialized
            set(undefined)
        })

export const info: Readable<API.v1.GetInfoResponse | undefined> = derived(
    [activeBlockchain],
    ([$activeBlockchain], set) => {
        if ($activeBlockchain) {
            getInfo(set, $activeBlockchain)
        }
    }
)

export const getPowerUpState = async (set: (v: any) => void, chain: ChainConfig) =>
    getResourceClient(chain)
        .v1.powerup.get_state()
        .then((result) => set(result))
        .catch((e) => {
            // TODO: We should probably have some sort of error catcher for stuff like this?
            console.error(e)
            // Set to undefined, which is the same as uninitialized
            set(undefined)
        })

// The state of the PowerUp system
export const statePowerUp: Readable<PowerUpState | undefined> = derived(
    [activeBlockchain],
    ([$activeBlockchain], set) => {
        if ($activeBlockchain && $activeBlockchain.chainFeatures.has(ChainFeatures.PowerUp)) {
            getPowerUpState(set, $activeBlockchain)
            const interval = setInterval(() => getPowerUpState(set, $activeBlockchain), 30000)
            return () => {
                clearInterval(interval)
            }
        }
    }
)

// Rent 1ms of the networks CPU
export const msToRent: Readable<number> = derived(activeBlockchain, ($activeBlockchain) => {
    if ($activeBlockchain.resourceSampleMilliseconds) {
        return $activeBlockchain.resourceSampleMilliseconds
    }
    return 1
})

//price per ms
export const cpuPowerupPrice = derived(
    [activeBlockchain, msToRent, sampleUsage, statePowerUp, info],
    ([$activeBlockchain, $msToRent, $sampleUsage, $statePowerUp, $info]) => {
        if ($msToRent && $sampleUsage && $statePowerUp) {
            return Asset.from(
                $statePowerUp.cpu.price_per_ms($sampleUsage, $msToRent, $info),
                $activeBlockchain.coreTokenSymbol
            )
        }
        return Asset.from(0, $activeBlockchain.coreTokenSymbol)
    }
)

// price per kb
export const netPowerupPrice = derived(
    [activeBlockchain,sampleUsage, statePowerUp, info],
    ([$activeBlockchain, $sampleUsage, $statePowerUp, $info]) => {
        if ($sampleUsage && $statePowerUp) {
            return Asset.from(
                $statePowerUp.net.price_per_kb($sampleUsage, 1, $info),
                $activeBlockchain.coreTokenSymbol
            )
        }
        return Asset.from(0, $activeBlockchain.coreTokenSymbol)
    }
)

//price per ms
export const cpuStakingPrice = derived(
    [activeBlockchain, msToRent, sampleUsage],
    ([$activeBlockchain, $msToRent, $sampleUsage]) => {
        if ($msToRent && $sampleUsage) {
            const { account } = $sampleUsage
            const cpu_weight = Number(account.total_resources.cpu_weight.units)
            const cpu_limit = Number(account.cpu_limit.max.value)
            let price = (cpu_weight / cpu_limit) * $msToRent
            return Asset.fromUnits(price * 1000, $activeBlockchain.coreTokenSymbol)
        }
        return Asset.from(0, $activeBlockchain.coreTokenSymbol)
    }
)

// price per kb for staking
export const netStakingPrice = derived(
    [activeBlockchain, sampleUsage],
    ([$activeBlockchain, $sampleUsage]) => {
        if ($sampleUsage) {
            const { account } = $sampleUsage
            const net_weight = Number(account.total_resources.net_weight.units)
            const net_limit = Number(account.net_limit.max.value)
            let price = net_weight / net_limit
            return Asset.fromUnits(price * 1000, $activeBlockchain.coreTokenSymbol)
        }
        return Asset.from(0, $activeBlockchain.coreTokenSymbol)
    }
)

export const getREXState = async (set: (v: any) => void, chain: ChainConfig) =>
    getResourceClient(chain)
        .v1.rex.get_state()
        .then((result) => set(result))
        .catch((e) => {
            // TODO: We should probably have some sort of error catcher for stuff like this?
            console.error(e)
            // Set to undefined, which is the same as uninitialized
            set(undefined)
        })

// The state of the REX system
export const stateREX: Readable<REXState | undefined> = derived(
    [activeBlockchain],
    ([$activeBlockchain], set) => {
        if ($activeBlockchain && $activeBlockchain.chainFeatures.has(ChainFeatures.REX)) {
            getREXState(set, $activeBlockchain)
            const interval = setInterval(() => getREXState(set, $activeBlockchain), 30000)
            return () => {
                clearInterval(interval)
            }
        }
    }
)

// The price of CPU in the REX system
export const cpuRexPrice = derived(
    [activeBlockchain, msToRent, sampleUsage, stateREX],
    ([$activeBlockchain, $msToRent, $sampleUsage, $stateREX]) => {
        if ($msToRent && $sampleUsage && $stateREX) {
            const price = $stateREX.price_per($sampleUsage, $msToRent * 30000);
            const coreTokenSymbol = $activeBlockchain.coreTokenSymbol
            return compatPriceWithPrecision(price, coreTokenSymbol)
        }
        return Asset.from(0, $activeBlockchain.coreTokenSymbol)
    }
)

// The price of Net in the REX system
export const netRexPrice = derived(
    [activeBlockchain, sampleUsage, stateREX],
    ([$activeBlockchain, $sampleUsage, $stateREX]) => {
        if ($sampleUsage && $stateREX) {
            const price = calculateNetRexPrice($stateREX, $sampleUsage, 30000)
            const coreTokenSymbol = $activeBlockchain.coreTokenSymbol
            return compatPriceWithPrecision(price, coreTokenSymbol)
        }
        return Asset.from(0, $activeBlockchain.coreTokenSymbol)
    }
)

function compatPriceWithPrecision(price : number, coreTokenSymbol : Asset.Symbol){
    let precision = coreTokenSymbol.precision;
    if (price > 0 && price < 1/Math.pow(10, precision)) {
        precision = Number(price.toExponential().split('-')[1])
    }
    return Asset.from(price, `${precision},${coreTokenSymbol.name}`)
}

function calculateNetRexPrice(stateRex: REXState, sample: SampleUsage, unit = 1000): number {
    // Sample token units
    const tokens = Asset.fromUnits(10000, stateRex.symbol)

    // Spending 1 EOS (10000 units) on REX gives this many tokens
    const bancor = Number(tokens.units) / (stateRex.total_rent.value / stateRex.total_unlent.value)
    // The ratio of the number of tokens received vs the sampled values
    const unitPrice = bancor * (Number(sample.net) / BNPrecision)
    // The token units spent per unit
    const perunit = Number(tokens.units) / unitPrice
    // Multiply the per unit cost by the units requested
    const cost = perunit * unit
    // Converting to an Asset
    return cost / Math.pow(10, stateRex.precision)
}

// The state of the REX system
export const stateRAM: Readable<RAMState | undefined> = derived(
    [activeBlockchain],
    ([$activeBlockchain], set) => {
        if ($activeBlockchain && $activeBlockchain.chainFeatures.has(ChainFeatures.BuyRAM)) {
            getRAMState(set, $activeBlockchain)
            const interval = setInterval(() => getRAMState(set, $activeBlockchain), 30000)
            return () => {
                clearInterval(interval)
            }
        }
    }
)

export const getRAMState = async (set: (v: any) => void, chain: ChainConfig) =>
    getResourceClient(chain)
        .v1.ram.get_state()
        .then((result) => set(result))
        .catch((e) => {
            // TODO: We should probably have some sort of error catcher for stuff like this?
            console.error(e)
            // Set to undefined, which is the same as uninitialized
            set(undefined)
        })
