import { fioTransfer } from './transfer/fio';
import { defaultTransfer } from './transfer/default';

export async function transfer(activeBlockchain: Object, activeSession: Object, properties: Object) {
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
