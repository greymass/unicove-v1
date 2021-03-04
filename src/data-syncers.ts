import {Asset, UInt64, LinkSession} from 'anchor-link'
import {wait} from "~/helpers";
import {ChainConfig} from "~/config";
import {fetchActiveBlockchain, fetchActiveSession, fetchActiveAccount, txFees, setTxFee} from "~/store";

export async function syncTxFee() {
    while (true) {
        const session: LinkSession = await fetchActiveSession()

        if (!session) {
            await wait(15000)

            continue
        }

        const blockchain: ChainConfig = await fetchActiveBlockchain(session)

        if (!blockchain.hasFees) {
            await wait(15000)

            continue
        }

        await fetchFee(session, blockchain).catch(error => {
            console.log('An error occured while fetching tx fee amount', { error })
        })

        await wait(15000)
    }
}

export function syncAll() {
    syncTxFee()
}

export async function fetchFee(session, blockchain) {
    const fees = await session.client.v1.chain.get_table_rows({
        code: `${blockchain.id}.fee`,
        table: `${blockchain.id}fees`,
        scope: `${blockchain.id}.fee`,
        key_type: "i64",
        index_position: "primary",
        lower_bound: UInt64.from(5),
        upper_bound: UInt64.from(5),
        limit: 1
    });

    const fee = Asset.fromUnits(fees.rows[0].suf_amount, blockchain.coreTokenSymbol)

    txFees.update(txFees => ({
        ...txFees,
        [blockchain.id]: fee,
    }))
}
