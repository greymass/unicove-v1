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
import {Readable, readable} from 'svelte/store'
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
async function getOraclePairs(chain: ChainConfig) {
    const client = getClient(chain)
    let rows: any[] = await cachedRead({
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
        updateAge: 8.64e7, // 1 day
    })
    return rows.map((p: any) => Pair.from(p)).filter((p) => p.active)
}

/** Loads latest datapoint for given pair. */
async function getOracleDatapoint(chain: ChainConfig, pair: Pair) {
    const client = getClient(chain)
    let data = await cachedRead({
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
        maxAge: MAX_AGE, // 2 hours
        updateAge: UPDATE_INTERVAL, // 1 minute
    })
    return Datapoint.from(data)
}

/** Gets the price in USD for given chain and pair, if pair is omitted the chains core symbol is used.  */
export async function getPrice(chain: ChainConfig, pairName?: string) {
    if (chain.testnet) {
        // all prices are zero on testnets
        return 0
    }
    if (chain.chainFeatures.has(ChainFeatures.DelphiOracle)) {
        let pairs = await getOraclePairs(chain)
        let pair: Pair | undefined
        if (!pairName) {
            // use core symbol for pair
            pair = pairs.find(
                (p) => p.base_symbol.equals(chain.coreTokenSymbol) && p.quote_symbol.name === 'USD'
            )
        } else {
            pair = pairs.find((p) => p.name.equals(pairName))
        }
        if (!pair) {
            throw new Error(`Unknown pair ${pairName} on ${chain.id}`)
        }
        const datapoint = await getOracleDatapoint(chain, pair)
        const price = datapoint.median.toNumber() / Math.pow(10, pair.quoted_precision.toNumber())
        return price
    } else {
        throw new Error('TODO: fallback price feed')
    }
}

const tickerStores: Record<string, Readable<number | null>> = {}

/**
 * Returns a refreshing store wrapping [[getPrice]]
 * @note Does not throw on error, price will remain null and error will be logged to console.
 * @note Does not resolve on testnets, store will stay null.
 */
export function priceTicker(chain: ChainConfig, pairName?: string) {
    const tickerName = `${chain.id}-${pairName || 'coresymbol'}`
    if (tickerStores[tickerName]) {
        return tickerStores[tickerName]
    }
    const ticker = readable<number | null>(null, (set) => {
        if (chain.testnet) {
            return // don't resolve a to a price on testnets
        }
        const load = () => {
            getPrice(chain, pairName)
                .then(set)
                .catch((error) => {
                    console.warn(`Error when updating price for ${pairName} on ${chain.id}`, error)
                })
        }
        const timer = setInterval(load, UPDATE_INTERVAL / 2)
        load()
        return () => {
            clearInterval(timer)
        }
    })
    tickerStores[tickerName] = ticker
    return ticker
}
