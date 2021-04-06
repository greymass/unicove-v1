import {Name, PublicKey, Asset} from '@greymass/eosio'

export const enum Step {
    Recipient,
    Amount,
    Confirm,
}

export interface TransferData {
    step: Step
    amount?: number
    displaySuccessTx?: string
    memo?: string
    toAccount?: Name
    toAddress?: PublicKey
}
