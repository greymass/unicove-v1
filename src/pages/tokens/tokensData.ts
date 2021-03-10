import {writable, get} from 'svelte/store'

import type {LinkSession} from 'anchor-link'

import type {TokensData} from './types'

export const tokensData = writable<{ string: TokensData } | undefined>(undefined)

import type {ChainConfig} from '~/config'
import {activeBlockchain, activeSession} from '~/store'

let interval: any

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

    if (!session) {
        return;
    }

    const apiUrl = `https://www.api.bloks.io/${
        blockchain.id
    }/account/${
        session.auth.actor
    }?type=getAccountTokens&coreSymbol=${
        blockchain.coreTokenSymbol
    }`

    const apiResponse = await fetch(apiUrl)

    console.log({apiResponse})

    tokensData.set(parseResponse(apiResponse))
}

function parseResponse(apiResponse: any) : { string: TokensData } {
    // Parse response here
    return {}
}
