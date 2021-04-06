import {Name, PublicKey} from '@greymass/eosio'

export const enum Step {
    Recipient,
    Amount,
    Confirm,
}

export interface TransferData {
    step: Step
    amount?: string
    displaySuccessTx?: string
    memo?: string
    toAccount?: Name
    toAddress?: PublicKey
}
