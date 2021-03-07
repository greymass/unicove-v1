import {SigningRequest} from 'eosio-signing-request'

import zlib from 'pako'

export const opts = {
    // Implement the rest of the ESR options
    zlib,
}

export async function request(params: any): Promise<SigningRequest> {
    return SigningRequest.from(`esr:${params.payload}`, opts)
}
