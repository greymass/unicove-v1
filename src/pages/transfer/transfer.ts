import {writable} from 'svelte/store'

import type {Asset, Name, PublicKey} from '@greymass/eosio'

export const enum Step {
    Token,
    Recipient,
    Amount,
    Confirm,
    Memo,
    Receive,
}

export interface TransferData {
    step: Step
    backStep?: Step
    tokenKey?: string
    quantity?: Asset
    displaySuccessTx?: string
    memo?: string
    toAccount?: Name | undefined
    toAddress?: PublicKey | undefined
}

export const transferData = writable<TransferData>({step: Step.Recipient})
