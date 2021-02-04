import {Asset, LinkSession, UInt64} from 'anchor-link'
import {FIOTransfer} from '~/abi-types';
import type {ChainConfig} from '~/config';

export async function fioTransfer(
    activeBlockchain: ChainConfig,
    activeSession: LinkSession,
    transferProperties: FIOTransfer
) {
    const txFee = await loadFee(activeBlockchain, activeSession);
    const transferData = generateTransfer(activeSession, transferProperties, txFee);
    transact(activeBlockchain, activeSession, transferData);
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

function generateTransfer(activeSession: LinkSession, transferProperties: FIOTransfer, txFee: Asset) {
    const { amount, payee_public_key } = transferProperties;

    return FIOTransfer.from({
        payee_public_key: payee_public_key,
        amount: amount,
        max_fee: txFee,
        actor: activeSession!.auth.actor,
        tpid: 'tpid@greymass',
    });
}

async function transact(
    activeBlockchain: ChainConfig,
    activeSession: LinkSession,
    transferData: FIOTransfer,
) {
    return await activeSession!.transact({
        action: {
            authorization: [activeSession!.auth],
            account: activeBlockchain.coreTokenContract,
            name: activeBlockchain.coreTokenTransfer,
            data: transferData,
        },
    });
}
