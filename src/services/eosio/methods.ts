import { fioTransfer } from './transfer/fio';
import { defaultTransfer } from './transfer/default';
import { Transfer, Blockchain, Session } from './interfaces';

export async function transfer(activeBlockchain: Blockchain, activeSession: Session, properties: Transfer) {
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
