import {SigningRequest} from 'eosio-signing-request'
import type {LinkChain} from 'anchor-link'

import {activeBlockchain, activeSession} from '~/store'

import zlib from 'pako'

let chainId: string
activeBlockchain.subscribe((value) => (chainId = value.chainId))

let linkChain: LinkChain
activeSession.subscribe((session) => {
    if (session) {
        linkChain = session.link.getChain(chainId)
    }
})

export async function getRequest(params: any): Promise<SigningRequest> {
    const opts = {
        abiProvider: linkChain,
        zlib,
    }
    return SigningRequest.from(`esr:${params.payload}`, opts)
}
