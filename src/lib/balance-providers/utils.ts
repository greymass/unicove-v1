import type {ChainConfig} from '~/config'

import {BalanceProviders} from './types'
import {BloksProvider} from './bloks'
import {LightAPIProvider} from './light-api'

export function getBalanceProvider(name: BalanceProviders, chain: ChainConfig) {
    switch (name) {
        case BalanceProviders.Bloks:
            return new BloksProvider(chain)
        case BalanceProviders.LightAPI:
            return new LightAPIProvider(chain)
        default:
            return null
    }
}
