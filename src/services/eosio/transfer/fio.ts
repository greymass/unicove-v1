import {Asset, Name, UInt64} from 'anchor-link'
import {FIOTransfer} from "~/abi-types";

export async function transferFio(
    activeBlockchain: Object,
    activeSession: Object,
    properties: Object
) {
    const {
        toAddress,
        quantity,
    } = properties;

    const txFee = await loadFee(activeSession, activeBlockchain);
    const data = generateTransfer(activeSession, properties, txFee);
    transact(activeBlockchain, activeSession, data);
}

async function loadFee(activeBlockchain: Object, activeSession: Object) {
    const fees = await activeSession!.client.v1.chain.get_table_rows({
        code: 'fio.fee',
        table: 'fiofees',
        scope: 'fio.fee',
        key_type: 'i64',
        index_position: 'primary',
        lower_bound: UInt64.from(5),
        upper_bound: UInt64.from(5),
        limit: 1,
    });

    return Asset.fromUnits(fees.rows[0].suf_amount, activeBlockchain.coreTokenSymbol)
}

function generateTransfer(activeSession: Object, properties: Object, txFee: Object) {
    const { quantity, toAddress } = properties;

    return FIOTransfer.from({
        payee_public_key: toAddress,
        amount: quantity.units,
        max_fee: txFee.units,
        actor: activeSession!.auth.actor,
        tpid: 'tpid@greymass',
    });
}

async function transact(
    activeSession: Object,
    activeBlockchain: Object,
    data: Object
) {
    return await activeSession!.transact({
        action: {
            authorization: [activeSession!.auth],
            account: activeBlockchain.coreTokenContract,
            name: activeBlockchain.coreTokenTransfer,
            data,
        },
    });
}
