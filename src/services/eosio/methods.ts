import type {LinkSession} from 'anchor-link';
import {isInstanceOf} from '@greymass/eosio';

import { fioTransfer } from './transfer/fio';
import { defaultTransfer } from './transfer/default';

import type {ChainConfig} from '~/config';
import {FIOTransfer as FIOTransferObject, Transfer as TransferObject} from '~/abi-types';

export async function transfer(activeBlockchain: ChainConfig, activeSession: LinkSession, properties: FIOTransferObject | TransferObject) {
    if (isInstanceOf(properties, FIOTransferObject)) {
        fioTransfer(activeBlockchain, activeSession, properties);
    } else if (isInstanceOf(properties, TransferObject)) {
        defaultTransfer(activeBlockchain, activeSession, properties);
    }
}
