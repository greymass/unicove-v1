import {Serializer} from '@greymass/eosio'
import {readable, derived, flatten, ReadableResult} from 'svelte-result-store'

import {DelphiOracleDatapoint, DelphiOraclePair} from '~/abi-types'
import {getClient} from '~/api-client'
import {ChainConfig, ChainFeatures} from '~/config'
import {cachedRead} from '~/db'

/** How often to update prices.  */
const UPDATE_INTERVAL = 1 * 60 * 1000 // 1 minute
/** How old price data can be displayed while it's updating in the background. */
const MAX_AGE = 2 * 60 * 60 * 1000 // 2 hours

/** Loads available pairs from the oracle. */
function getOraclePairs(chain: ChainConfig): ReadableResult<DelphiOraclePair[]> {
    const client = getClient(chain)
    const pairs: ReadableResult<any[]> = cachedRead({
        store: 'price-ticker',
        key: `${chain.id}-pairs`,
        load: async () => {
            let result = await client.v1.chain.get_table_rows({
                type: DelphiOraclePair,
                code: 'delphioracle',
                scope: 'delphioracle',
                table: 'pairs',
                limit: 500,
            })
            return Serializer.objectify(result.rows)
        },
        maxAge: 6.048e8, // 1 week
        refreshInterval: 8.64e7, // 1 day
    })
    return derived(pairs, ($pairs) => {
        return $pairs.map((p) => DelphiOraclePair.from(p)).filter((p) => p.active)
    })
}

/** Loads latest datapoint for given pair. */
function getOracleDatapoint(
    chain: ChainConfig,
    pair: DelphiOraclePair
): ReadableResult<DelphiOracleDatapoint> {
    const client = getClient(chain)
    const data = cachedRead({
        store: 'price-ticker',
        key: `${chain.id}-${pair.name}`,
        load: async () => {
            let result = await client.v1.chain.get_table_rows({
                type: DelphiOracleDatapoint,
                code: 'delphioracle',
                scope: `${pair.name}`,
                table: 'datapoints',
                limit: 1,
            })
            let latest = result.rows[0]
            if (!latest) {
                throw new Error(`No datapoints for ${pair.name} on ${chain.id}`)
            }
            return Serializer.objectify(latest)
        },
        maxAge: MAX_AGE,
        refreshInterval: UPDATE_INTERVAL,
    })
    return derived(data, ($data) => DelphiOracleDatapoint.from($data))
}

// function bloksFallback(chain: ChainConfig, pairName?: string): ReadableResult<number> {
//     const chainName = chain.id
//     return cachedRead({
//         store: 'price-ticker',
//         key: `${chainName}-fallback`,
//         load: async () => {
//             if (pairName) {
//                 throw new Error('Fallback only supports core symbol')
//             }
//             let url = 'https://www.api.bloks.io/ticker/banana'
//             if (chainName !== 'eos') {
//                 url = `https://www.api.bloks.io/${chainName}/ticker/banana`
//             }
//             const response = await fetch(url)
//             const data = await response.json()
//             if (typeof data === 'number') {
//                 return data
//             } else {
//                 throw new Error('Unexpected response from bloks')
//             }
//         },
//         maxAge: MAX_AGE,
//         refreshInterval: UPDATE_INTERVAL,
//     })
// }

const tickerStores: Record<string, ReadableResult<number>> = {}

/**
 * Latest price in USD for given chain and pair, if pair is omitted the chains core symbol is used.
 * @note Testnets will return zero for all pairs.
 */
export function priceTicker(chain: ChainConfig, pairName?: string): ReadableResult<number> {
    const tickerName = `${chain.id}-${pairName || 'coresymbol'}`
    if (tickerStores[tickerName]) {
        return tickerStores[tickerName]
    }
    const pairs: ReadableResult<DelphiOraclePair[]> = chain.chainFeatures.has(
        ChainFeatures.DelphiOracle
    )
        ? getOraclePairs(chain)
        : readable({value: []})

    const pair = derived(pairs, ($pairs) => {
        let pair: DelphiOraclePair | undefined
        if (!pairName) {
            // use core symbol for pair
            pair = $pairs.find(
                (p) => p.base_symbol.equals(chain.coreTokenSymbol) && p.quote_symbol.name === 'USD'
            )
        } else {
            pair = $pairs.find((p) => p.name.equals(pairName))
        }

        return pair || null
    })
    const datapoint = flatten(
        derived(pair, ($pair) => {
            if ($pair) {
                return getOracleDatapoint(chain, $pair)
            } else {
                return null
            }
        })
    )
    const ticker = flatten(
        derived([datapoint, pair], ([$datapoint, $pair]) => {
            if (chain.testnet) {
                // all prices are zero on testnets
                return 0
            } else if ($datapoint && $pair) {
                return (
                    $datapoint.median.toNumber() / Math.pow(10, $pair.quoted_precision.toNumber())
                )
            } else {
                return 0
                // TODO: bloksFallback failing, CORS, needs replaced.
                // return bloksFallback(chain, pairName)
            }
        })
    )

    tickerStores[tickerName] = ticker
    return ticker
}
