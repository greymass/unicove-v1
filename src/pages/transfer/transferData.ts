import {derived, writable} from 'svelte/store'
import {Asset} from 'anchor-link'

import type {TransferData} from './types'
import {Step} from './types'

import {fetchActiveBlockchain} from '~/store'
import type {ChainConfig} from '~/config';

export const transferData = writable<TransferData>({step: Step.Recipient})

export const quantity = derived<typeof transferData, Asset>(transferData, (data, set) => {
    fetchActiveBlockchain().then(activeBlockchainData => {
        let parsed: number = parseFloat(data.amount || '')
        let asset: Asset = Asset.fromUnits(0, activeBlockchainData.coreTokenSymbol)

        if (isNaN(parsed) || parsed === 0) {
            asset = Asset.fromUnits(0, activeBlockchainData.coreTokenSymbol)
        } else {
            asset = Asset.fromFloat(parsed, activeBlockchainData.coreTokenSymbol)
        }

        set(asset)
    })
})
