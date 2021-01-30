import {Asset, Name, UInt64} from 'anchor-link';
import { fioTransfer } from './transfer/fio';
import { defaultTransfer } from './transfer/default';

import { FIOTransfer, Transfer } from '../../abi-types'

async function transfer(activeBlockchain: Object, activeSession: Object, properties: Object) {
    let toAccount = ''
    let toAddress = ''
    let value = ''
    let quantity = Asset.fromUnits(parseFloat(value), $activeBlockchain.coreTokenSymbol)
    let memo = ''
    let txfee = Asset.fromUnits(0, $activeBlockchain.coreTokenSymbol)

    let data
    switch (activeBlockchain.id) {
        case 'fio': {
            data = fioTransfer(activeBlockchain, activeSession, properties);
            break
        }
        default: {
            data = defaultTransfer(activeBlockchain, activeSession, properties);
            break
        }
    }
}
