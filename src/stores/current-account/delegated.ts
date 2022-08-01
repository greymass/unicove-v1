import {Asset} from 'anchor-link'
import {derived} from 'svelte/store'
import type {Readable} from 'svelte/store'
import {currentAccount} from './account'
import {activeBlockchain} from '~/store'
import {DelegatedBandwidth} from '~/abi-types'

import {getClient} from '~/api-client'
import {ChainFeatures} from '~/config'

interface Delegations {
    rows: DelegatedBandwidth[]
}

export const currentDelegations: Readable<Delegations> = derived(
    [activeBlockchain, currentAccount],
    ([$activeBlockchain, $currentAccount], set) => {
        if (
            $activeBlockchain &&
            $activeBlockchain.chainFeatures.has(ChainFeatures.Staking) &&
            $currentAccount
        ) {
            getClient($activeBlockchain.chainId)
                .v1.chain.get_table_rows({
                    code: 'eosio',
                    table: 'delband',
                    scope: $currentAccount.account_name,
                    type: DelegatedBandwidth,
                })
                .then((result) => {
                    set(result)
                })
                .catch((err) => {
                    console.warn('Error retrieving delegations', err)
                    set({rows: []})
                })
        }
    }
)

export const currentDelegatedTokens: Readable<Asset> = derived(
    [activeBlockchain, currentAccount, currentDelegations],
    ([$activeBlockchain, $currentAccount, $currentDelegations]) => {
        let delegated = 0
        if ($currentAccount && $currentDelegations && $currentDelegations.rows.length > 0) {
            $currentDelegations.rows
                .filter((record) => record.from.equals($currentAccount.account_name))
                .forEach((record) => {
                    delegated += record.cpu_weight.value
                    delegated += record.net_weight.value
                })
        }
        return Asset.from(delegated, $activeBlockchain.coreTokenSymbol)
    }
)
