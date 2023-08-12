import {AnyAction, APIClient, BlockTimestamp, Checksum256, Struct, UInt32} from '@wharfkit/antelope'
import {readable, ReadableResult} from 'svelte-result-store'

import {getClient} from '~/api-client'
import type {ChainConfig} from '~/config'

export interface TransactionStatus {
    status: 'pending' | 'executed' | 'irreversible'
    info?: TransactionInfo
    block_num?: UInt32
    block_time?: BlockTimestamp
    until_irreversible?: number
}

export function followTransaction(id: Checksum256, chain: ChainConfig) {
    const client = getClient(chain)
    const ctx: PollContext = {interval: 10 * 1000}
    const tx = pollStore(null, () => getTransaction(id, client), ctx)
    return tx.map((result) => {
        if (result.value) {
            const {last_irreversible_block, block_num, trx: info, block_time} = result.value
            const until_irreversible = Math.max(
                0,
                Number(block_num) - Number(last_irreversible_block)
            )
            const irreversible = until_irreversible === 0
            if (irreversible) {
                // stop polling once we have an irreversible transaction
                ctx.stop!()
            }
            return {
                value: <TransactionStatus>{
                    block_num,
                    block_time,
                    until_irreversible,
                    info,
                    status: irreversible ? 'irreversible' : info.receipt.status,
                },
            }
        }
        // unable to find tx, could try to parse the error here but our light api is
        // not consistent with nodeos api so it's a bit of a pain. for now assume any
        // error is a transaction not found
        return {
            value: <TransactionStatus>{
                status: 'pending',
            },
        }
    })
}

export function exporerUrl(id: Checksum256, chain: ChainConfig) {
    let path: string = chain.explorerPath || 'transaction'
    return `${chain.explorerUrl}/${path}/${id}`
}

interface PollContext {
    interval: number
    stop?: () => void
}

function pollStore<T>(initial: T, fn: () => Promise<T>, ctx: PollContext): ReadableResult<T> {
    return readable<T>({value: initial}, (set, error) => {
        let running = true
        let timer: any
        const run = () => {
            const start = Date.now()
            fn()
                .then(set)
                .catch(error)
                .finally(() => {
                    if (running) {
                        const delta = Date.now() - start
                        timer = setTimeout(run, Math.max(0, ctx.interval - delta))
                    }
                })
        }
        run()
        ctx.stop = () => {
            running = false
            clearTimeout(timer)
        }
        return ctx.stop
    })
}

// FUTURE: this should be part of cores default api interfaces
interface TransactionTrace {}
interface TransactionReceipt {
    cpu_usage_us: number
    net_usage_words: number
    status: string
}
interface TransactionInfo {
    receipt: TransactionReceipt
    trx: {
        actions: AnyAction[]
        context_free_actions: AnyAction[]
        context_free_data: []
        delay_sec: number
        expiration: string
        max_cpu_usage_ms: number
        max_net_usage_words: number
        ref_block_num: number
        ref_block_prefix: number
        signatures: string[]
    }
}
@Struct.type('get_transaction_response')
class GetTransactionResponse extends Struct {
    @Struct.field(Checksum256) id!: Checksum256
    @Struct.field(UInt32) block_num!: UInt32
    @Struct.field(BlockTimestamp) block_time!: BlockTimestamp
    @Struct.field(UInt32) last_irreversible_block!: UInt32
    @Struct.field('any?') traces?: TransactionTrace[]
    @Struct.field('any') trx!: TransactionInfo
}

async function getTransaction(id: Checksum256, client: APIClient) {
    return client.call({
        path: '/v1/history/get_transaction',
        params: {traces: false, id},
        responseType: GetTransactionResponse,
    })
}
