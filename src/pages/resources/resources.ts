import {derived, Readable, writable} from 'svelte/store'
import {API, Asset} from '@greymass/eosio'
import {Resources, SampleUsage, PowerUpState, RAMState, REXState} from '@greymass/eosio-resources'
import {activeBlockchain} from '~/store'

import {getClient} from '../../api-client'
import {ChainConfig, ChainFeatures, resourceFeatures} from '~/config'

const getResourceClient = (chain: ChainConfig) => {
    const api = getClient(chain)
    const options: any = {api}
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
export const rexPrice = derived(
    [msToRent, sampleUsage, stateREX],
    ([$msToRent, $sampleUsage, $stateREX]) => {
        if ($msToRent && $sampleUsage && $stateREX) {
            return Asset.from($stateREX.price_per($sampleUsage, $msToRent * 30000), '4,EOS')
        }
        return Asset.from(0, '4,EOS')
    }
)

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
