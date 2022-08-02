import {writable} from 'svelte/store'

import type {Asset, Name, PublicKey} from '@greymass/eosio'

export const enum Step {
    Token,
    Recipient,
    Amount,
    Confirm,
    Memo,
    Sending,
    Sent,
    Failed,
    Receive,
}

export interface TransferData {
    // Navigation
    step: Step
    backStep?: Step
    // Form Data
    tokenKey?: string
    quantity?: Asset
    memo?: string
    toAccount?: Name | undefined
    toAddress?: PublicKey | undefined
}

export const transferData = writable<TransferData>({step: Step.Recipient})
