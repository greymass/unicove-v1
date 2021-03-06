import {writable} from 'svelte/store'

import type {TokensData} from './types'

export const tokensData = writable<{ string: TokensData }>({step: Step.Recipient})

import {writable, get} from 'svelte/store'
import {Asset, UInt64, LinkSession} from 'anchor-link'
import type {ChainConfig} from '~/config'
import {activeBlockchain, activeSession} from '~/store'

let interval: any

export const tokensData = writable<Asset | undefined>(undefined)

export function syncTokenBalances() {
    interval = setInterval(() => {
        fetchTxFee().catch((error) => {
            console.log('An error occured while fetching token balances', {error})
        })
    }, 15 * 60 * 1000)
}

export function stopSyncTokenBalances() {
    clearInterval(interval)
}

export async function fetchTxFee() {
    const session: LinkSession | undefined = get(activeSession)
    const blockchain: ChainConfig = get(activeBlockchain)

    const apiUrl = `https://www.api.bloks.io/${
        blockchain.id
    }/account/${
        session.accountName
    }?type=getAccountTokens&coreSymbol=${
        blockchain.symbol
    }`

    const apiResponse = await fetch(apiUrl)

    tokensData.set(parseResponse(apiResponse))
}

function parseResponse(apiResponse) {
    // Parse response here
}
