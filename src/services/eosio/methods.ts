import type {LinkSession} from 'anchor-link';

import { fioTransfer } from './transfer/fio';
import { defaultTransfer } from './transfer/default';

import type {ChainConfig} from '~/config';
import type {FIOTransfer, Transfer} from '~/abi-types';

export async function transfer(activeBlockchain: ChainConfig, activeSession: LinkSession, properties: FIOTransfer | Transfer) {
    switch (activeBlockchain.id) {
        case 'fio': {
            fioTransfer(activeBlockchain, activeSession, properties);
            break
        }
        default: {
            defaultTransfer(activeBlockchain, activeSession, properties);
            break
        }
    }
}
