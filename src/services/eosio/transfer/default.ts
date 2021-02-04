import type {LinkSession} from 'anchor-link';
import type {Transfer} from '~/abi-types';
import type {ChainConfig} from '~/config';

interface TransferData {

}

export async function defaultTransfer(
    activeSession: LinkSession,
    activeBlockchain: ChainConfig,
    transferProperties: Transfer,
) {
    const data = generateTransfer(activeSession, transferProperties);

    console.log({data})

    transact(activeBlockchain, activeSession, data);
}

function generateTransfer(
    activeSession: LinkSession,
    transferProperties: Transfer,
) {
    const { quantity, to, memo } = transferProperties;

    return Transfer.from({
        from: activeSession!.auth.actor,
        to,
        quantity,
        memo,
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
