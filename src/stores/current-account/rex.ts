import {Asset} from 'anchor-link'
import {derived} from 'svelte/store'
import type {Readable} from 'svelte/store'
import {stateREX} from '~/pages/resources/resources'

import {activeBlockchain, activePriceTicker} from '~/store'
import {currentAccount} from './account'

export const currentREXBalance: Readable<Asset> = derived(
    [activeBlockchain, currentAccount, stateREX],
    ([$activeBlockchain, $currentAccount, $stateREX]) => {
        if ($currentAccount && $currentAccount.rex_info && $stateREX) {
            return $stateREX.exchange($currentAccount.rex_info.rex_balance)
        }
        return Asset.from(0, $activeBlockchain.coreTokenSymbol)
    }
)

export const currentREXBalanceValue: Readable<Asset> = derived(
    [activePriceTicker, currentREXBalance],
    ([$activePriceTicker, $currentREXBalance]) => {
        console.log($activePriceTicker)
        if ($activePriceTicker && $currentREXBalance) {
            return Asset.from($currentREXBalance.value * $activePriceTicker, '2,USD')
        }
        return Asset.from(0, '2,USD')
    }
)
