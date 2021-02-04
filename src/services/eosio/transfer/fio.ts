import {Asset, LinkSession, UInt64} from 'anchor-link'
import {FIOTransfer} from '~/abi-types';
import {ChainConfig} from '~/config';

interface TransferData {

}

export async function fioTransfer(
    activeBlockchain: ChainConfig,
    activeSession: LinkSession,
    transferProperties: FIOTransfer
) {
    const txFee = await loadFee(activeSession, activeBlockchain);
    const data = generateTransfer(activeSession, transferProperties, txFee);
    transact(activeBlockchain, activeSession, data);
}

async function loadFee(activeBlockchain: ChainConfig, activeSession: LinkSession) {
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

function generateTransfer(activeSession: LinkSession, transferProperties: FIOTransfer, txFee: Object) {
    const { amount, toAddress } = transferProperties;

    return FIOTransfer.from({
        payee_public_key: toAddress,
        amount: amount.units,
        max_fee: txFee.units,
        actor: activeSession!.auth.actor,
        tpid: 'tpid@greymass',
    });
}

async function transact(
    activeSession: LinkSession,
    activeBlockchain: ChainConfig,
    data: TransferData
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
