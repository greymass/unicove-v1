import {derived, writable, get} from 'svelte/store'
import {Asset} from 'anchor-link'

import type {TransferData} from './types'
import {Step} from './types'

import type {ChainConfig} from '~/config'
import {activeBlockchain} from '~/store'

export const transferData = writable<TransferData>({step: Step.Recipient})

export const quantity = derived<typeof transferData, Asset>(transferData, (data, set) => {
    const blockchain: ChainConfig = get(activeBlockchain)
    let parsed: number = parseFloat(data.amount || '')
    let asset: Asset = Asset.fromUnits(0, blockchain.coreTokenSymbol)

    if (isNaN(parsed) || parsed === 0) {
        asset = Asset.fromUnits(0, blockchain.coreTokenSymbol)
    } else {
        asset = Asset.fromFloat(parsed, blockchain.coreTokenSymbol)
    }

    set(asset)
})
