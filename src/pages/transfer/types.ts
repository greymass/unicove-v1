import type {Asset} from 'anchor-link'

export const enum Step {
    Recipient,
    Amount,
    Confirm,
}

export interface TransferData {
    memo?: string
    quantity?: Asset
    toAccount?: string
    toAddress?: string
    amount?: string
    displaySuccessTx?: string
    step: Step
    token?: string
}
