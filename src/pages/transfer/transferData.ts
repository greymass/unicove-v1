import {derived, writable} from 'svelte/store'
import {Asset} from 'anchor-link'

import type {TransferData} from './types'
import {Step} from './types'

import {activeBlockchain} from '~/store'

export const transferData = writable<TransferData>({step: Step.Recipient})

export const quantity = derived(transferData, (data) => {
    console.log({data})
    let parsed = parseFloat(data.amount)
    if (isNaN(parsed) || parsed === 0) {
        return Asset.fromUnits(0, $activeBlockchain.coreTokenSymbol)
    } else {
        return Asset.fromFloat(parsed, $activeBlockchain.coreTokenSymbol)
    }
})
