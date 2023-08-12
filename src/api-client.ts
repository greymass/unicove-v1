import {APIClient, Checksum256} from '@wharfkit/antelope'
import {ChainConfig, chains} from './config'

const clients = new Map<string, APIClient>()

/**
 * Get a APIClient instance for given chain config or chain id.
 */
export function getClient(chainOrId: ChainConfig | Checksum256): APIClient {
    let chain: ChainConfig
    if (chainOrId instanceof Checksum256) {
        const id = String(chainOrId)
        chain = chains.find((cfg) => cfg.chainId.equals(id))!
        if (!chain) {
            throw new Error(`Unconfigured chain: ${id}`)
        }
    } else {
        chain = chainOrId
    }
    let client = clients.get(String(chain.chainId))
    if (!client) {
        client = new APIClient({url: chain.nodeUrl})
        clients.set(String(chain.chainId), client)
    }
    return client
}
