import {APIClient, ChainId} from 'anchor-link'
import {ChainConfig, chains} from './config'

const clients = new Map<ChainId, APIClient>()

/**
 * Get a APIClient instance for given chain config or chain id.
 */
export function getClient(chainOrId: ChainConfig | ChainId): APIClient {
    let chain: ChainConfig
    if (chainOrId instanceof ChainId) {
        const id = String(chainOrId)
        chain = chains.find((cfg) => cfg.chainId.equals(id))!
        if (!chain) {
            throw new Error(`Unconfigured chain: ${id}`)
        }
    } else {
        chain = chainOrId
    }
    let client = clients.get(chain.chainId)
    if (!client) {
        client = new APIClient({url: chain.nodeUrl})
        clients.set(chain.chainId, client)
    }
    return client
}
