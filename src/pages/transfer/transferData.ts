import {derived, writable, get} from 'svelte/store'
import {Asset} from 'anchor-link'

import type {TransferData} from './types'
import {Step} from './types'

import type {ChainConfig} from '~/config'
import {activeBlockchain, activeSession} from '~/store'
import {tokenBalancesTicker} from '~/token-balances-ticker'

export const transferData = writable<TransferData>({step: Step.Recipient})

export const quantity = derived<typeof transferData, Asset>(transferData, (data, set) => {
    const blockchain: ChainConfig = get(activeBlockchain)
    const session: ChainConfig = get(activeSession)

    let parsed: number = parseFloat(data.amount || '')
    const tokenBalances = tokenBalancesTicker(session, blockchain).catch((error) => {
        console.warn(`Unable to load price on ${blockchain.id}`, error)
    })
    const asset = derived(tokenBalances, ($tokenBalances) => {
        const tokenObject = $tokenBalances[data.token]

        const assetSymbol = Asset.Symbol.from(`${tokenObject.decimals},${tokenObject.currency}`)

        let asset: Asset = Asset.fromUnits(
            0,
            assetSymbol
        )

        console.log({asset})

        if (isNaN(tokenObject.amount) || parsed === 0) {
            return Asset.fromUnits(0, assetSymbol)
        } else {
            return Asset.fromFloat(tokenObject.amount, assetSymbol)
        }
    })

    return asset
})
