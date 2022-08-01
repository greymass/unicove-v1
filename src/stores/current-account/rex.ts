import {Asset} from 'anchor-link'
import {derived} from 'svelte/store'
import type {Readable} from 'svelte/store'
import {stateREX} from '~/pages/resources/resources'

import {activeBlockchain} from '~/store'
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
