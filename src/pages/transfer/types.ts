export const enum Step {
    Recipient,
    Amount,
    Confirm,
}

export interface TransferData {
    memo?: string
    toAccount?: string
    toAddress?: string
    amount?: string
    displaySuccessTx?: string
    step: Step
    token?: string
}
