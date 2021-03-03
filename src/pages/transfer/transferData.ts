import {derived, writable} from 'svelte/store'
import {Asset} from 'anchor-link'

import type {TransferData} from './types'
import {Step} from './types'

import {activeBlockchain} from '~/store'

export const transferData = writable<TransferData>({step: Step.Recipient})

export const quantity = derived(transferData, async (data) => {
    const activeBlockchainData = await new Promise(resolve => {
        activeBlockchain.subscribe(chainData => {
            resolve(chainData)
        })
    })
    let parsed = parseFloat(data.amount)
    if (isNaN(parsed) || parsed === 0) {
        return Asset.fromUnits(0, activeBlockchainData.coreTokenSymbol)
    } else {
        return Asset.fromFloat(parsed, activeBlockchain.coreTokenSymbol)
    }
})
