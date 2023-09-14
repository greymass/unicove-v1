import { wait } from "~/helpers"
import { EvmSession as EosEvmSession } from "./eos"
import { EvmSession as TelosEvmSession } from "./telos"
import { get } from "svelte/store"
import { activeBlockchain, activeEvmSession, activeSession } from "~/store"

export type EvmSession = EosEvmSession | TelosEvmSession

let connectingToEvm = false

export async function startEvmSession(): Promise<EvmSession | undefined> {
    let evmSession: EvmSession

    if (connectingToEvm) {
        await wait(5000)
        return startEvmSession()
    }
    
    connectingToEvm = true

    const blockchain = get(activeBlockchain)

    try {
        evmSession = await createEvmSession(blockchain.id)
    } catch (e) {
        if (e.code === -32002) {
            await wait(5000)
            return startEvmSession()
        }

        if (!e.message) {
            connectingToEvm = false
            return
        }

        throw new Error(`Could not connect to EVM. Error: ${e.message}`)
    }

    if (evmSession) {
        activeEvmSession.set(evmSession)
        connectingToEvm = false
    }

    return evmSession
}

async function createEvmSession(chainName: string): Promise<EvmSession> {
    if (chainName === 'telos') {
        const nativeSession = get(activeSession)
        
        return TelosEvmSession.from({nativeAccountName: nativeSession!.auth.actor})
    } else if (chainName === 'eos') {
        return EosEvmSession.from({ chainName })
    } else {
        throw new Error(`The EVM of this chain is not supported: ${chainName}`)
    }

}

