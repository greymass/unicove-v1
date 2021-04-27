import {writable} from 'svelte/store'

import type {Asset, Name, PublicKey} from '@greymass/eosio'

export const enum Step {
    Recipient,
    Amount,
    Confirm,
}

export interface TransferData {
    step: Step
    quantity?: Asset
    displaySuccessTx?: string
    memo?: string
    toAccount?: Name | undefined
    toAddress?: PublicKey | undefined
}

export const transferData = writable<TransferData>({step: Step.Recipient})
