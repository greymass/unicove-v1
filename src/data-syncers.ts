import {Asset, UInt64, LinkSession} from 'anchor-link'
import {wait} from "~/helpers";
import {ChainConfig} from "~/config";
import {fetchActiveBlockchain, fetchActiveSession, fetchActiveAccount, txFee, setTxFee} from "~/store";

export async function syncTxFee() {
    while (true) {
        const session: LinkSession = await fetchActiveSession()

        if (!session) {
            console.log('before')
            await wait(15000)
            console.log('after')

            continue
        }

        const blockchain: ChainConfig = await fetchActiveBlockchain(session)

        const fee = await fetchFee(session, blockchain).catch(error => {
            console.log('An error occured while fetching tx fee amount', { error })
        })

        txFee.update(txFees => ({
            ...txFees,
            [blockchain.id]: fee,
        }))

        console.log('before')
        await wait(15000)
        console.log('after')
    }
}

export function syncAll() {
    syncTxFee()
}

async function fetchFee(session, blockchain) {
    console.log({session})
    const fees = await session.client.v1.chain.get_table_rows({
        code: "fio.fee",
        table: "fiofees",
        scope: "fio.fee",
        key_type: "i64",
        index_position: "primary",
        lower_bound: UInt64.from(5),
        upper_bound: UInt64.from(5),
        limit: 1
    });

    return Asset.fromUnits(fees.rows[0].suf_amount, blockchain.coreTokenSymbol);
}
