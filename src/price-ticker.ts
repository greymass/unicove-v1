import {
    Asset,
    Name,
    Serializer,
    Struct,
    TimePoint,
    TypeAlias,
    UInt16,
    UInt64,
} from '@greymass/eosio'

import {readable, derived, flatten, ReadableResult} from 'svelte-result-store'

import {ChainConfig, ChainFeatures} from './config'
import {getClient} from './api-client'
import {cachedRead} from './db'

/** How often to update prices.  */
const UPDATE_INTERVAL = 1 * 60 * 1000 // 1 minute
/** How old price data can be displayed while it's updating in the background. */
const MAX_AGE = 2 * 60 * 60 * 1000 // 2 hours

@TypeAlias('asset_type')
class AssetType extends UInt16 {
    // fiat=1,
    // cryptocurrency=2,
    // erc20_token=3,
    // eosio_token=4,
    // equity=5,
    // derivative=6,
    // other=7
}

@Struct.type('datapoints')
export class Datapoint extends Struct {
    @Struct.field(UInt64) id!: UInt64
    @Struct.field(Name) owner!: Name
    @Struct.field(UInt64) value!: UInt64
    @Struct.field(UInt64) median!: UInt64
    @Struct.field(TimePoint) timestamp!: TimePoint
}

@Struct.type('pairs')
export class Pair extends Struct {
    @Struct.field('bool') active!: boolean
    @Struct.field('bool') bounty_awarded!: boolean
    @Struct.field('bool') bounty_edited_by_custodians!: boolean
    @Struct.field(Name) proposer!: Name
    @Struct.field(Name) name!: Name
    @Struct.field(Asset) bounty_amount!: Asset
    @Struct.field(Name, {array: true}) approving_custodians!: Name[]
    @Struct.field(Name, {array: true}) approving_oracles!: Name[]
    @Struct.field(Asset.Symbol) base_symbol!: Asset.Symbol
    @Struct.field(AssetType) base_type!: AssetType
    @Struct.field(Name) base_contract!: Name
    @Struct.field(Asset.Symbol) quote_symbol!: Asset.Symbol
    @Struct.field(AssetType) quote_type!: AssetType
    @Struct.field(Name) quote_contract!: Name
    @Struct.field(UInt64) quoted_precision!: UInt64
}

/** Loads available pairs from the oracle. */
function getOraclePairs(chain: ChainConfig): ReadableResult<Pair[]> {
    const client = getClient(chain)
    const pairs: ReadableResult<any[]> = cachedRead({
        store: 'price-ticker',
        key: `${chain.id}-pairs`,
        load: async () => {
            let result = await client.v1.chain.get_table_rows({
                type: Pair,
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
        return $pairs.map((p) => Pair.from(p)).filter((p) => p.active)
    })
}

/** Loads latest datapoint for given pair. */
function getOracleDatapoint(chain: ChainConfig, pair: Pair): ReadableResult<Datapoint> {
    const client = getClient(chain)
    const data = cachedRead({
        store: 'price-ticker',
        key: `${chain.id}-${pair.name}`,
        load: async () => {
            let result = await client.v1.chain.get_table_rows({
                type: Datapoint,
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
    return derived(data, ($data) => Datapoint.from($data))
}

function bloksFallback(chain: ChainConfig, pairName?: string): ReadableResult<number> {
    const chainName = chain.id
    return cachedRead({
        store: 'price-ticker',
        key: `${chainName}-fallback`,
        load: async () => {
            if (pairName) {
                throw new Error('Fallback only supports core symbol')
            }
            let url = 'https://www.api.bloks.io/ticker/banana'
            if (chainName !== 'eos') {
                url = `https://www.api.bloks.io/${chainName}/ticker/banana`
            }
            const response = await fetch(url)
            const data = await response.json()
            if (typeof data === 'number') {
                return data
            } else {
                throw new Error('Unexpected response from bloks')
            }
        },
        maxAge: MAX_AGE,
        refreshInterval: UPDATE_INTERVAL,
    })
}

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
    const pairs: ReadableResult<Pair[]> = chain.chainFeatures.has(ChainFeatures.DelphiOracle)
        ? getOraclePairs(chain)
        : readable({value: []})
    const pair = derived(pairs, ($pairs) => {
        let pair: Pair | undefined
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
                return bloksFallback(chain, pairName)
            }
        })
    )
    tickerStores[tickerName] = ticker
    return ticker
}
