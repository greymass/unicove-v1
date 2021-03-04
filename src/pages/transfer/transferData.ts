import {derived, writable} from 'svelte/store'
import {Asset} from 'anchor-link'

import type {TransferData} from './types'
import {Step} from './types'

import {activeBlockchain} from '~/store'

export const transferData = writable<TransferData>({step: Step.Recipient})

export const quantity = derived(transferData, async (data, set) => {
    const activeBlockchainData = await new Promise(resolve => {
        activeBlockchain.subscribe(chainData => {
            resolve(chainData)
        })
    })
    let parsed = parseFloat(data.amount)
    let asset
    if (isNaN(parsed) || parsed === 0) {
        asset = Asset.fromUnits(0, activeBlockchainData.coreTokenSymbol)
    } else {
        asset = Asset.fromFloat(parsed, activeBlockchainData.coreTokenSymbol)
    }

    set(asset)
})
