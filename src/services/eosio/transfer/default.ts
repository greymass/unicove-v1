import {FIOTransfer, Transfer} from "~/abi-types";

export async function defaultTransfer(
    activeSession: Object,
    activeBlockchain: Object,
    properties: Object
) {
    const data = generateTransfer(activeSession, properties);

    transact(activeBlockchain, activeSession, data);
}

function generateTransfer(activeSession: Object, properties: Object) {
    const { quantity, toAccount, memo } = properties;

    return Transfer.from({
        from: activeSession!.auth.actor,
        to: toAccount,
        quantity,
        memo,
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
