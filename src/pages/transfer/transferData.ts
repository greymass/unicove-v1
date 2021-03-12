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
    const tokenBalances = tokenBalancesTicker(session, $activeBlockchain).catch((error) => {
        console.warn(`Unable to load price on ${$activeBlockchain.id}`, error)
    })
    const tokenBalancesObject = data.token && get(tokenBalances) // add that to store.ts
    const token = tokenBalancesObject && tokenBalancesObject[data.token]
    const assetSymbol = token ? blockchain.coreTokenSymbol :
        Asset.Symbol.from(`${token.decimals},${token.currency}`)
    let asset: Asset = Asset.fromUnits(
        0,
        assetSymbol
    )

    if (isNaN(parsed) || parsed === 0) {
        asset = Asset.fromUnits(0, assetSymbol)
    } else {
        asset = Asset.fromFloat(parsed, assetSymbol)
    }

    set(asset)
})
