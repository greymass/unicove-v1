import {writable} from 'svelte/store'

import type {Asset} from '@greymass/eosio'

export const enum Step {
    Loading,
    Setup,
    Confirm,
    Complete,
    Overview,
    Deposit,
    Withdraw,
}

export interface EarnData {
    // Navigation
    step: Step
    backStep?: Step
    // Form Data
    quantity?: Asset
}

const defaultData = {
    step: Step.Loading,
    backStep: undefined,
    quantity: undefined,
}

export const earnData = writable<EarnData>(defaultData)

export function resetEarnData() {
    earnData.set({...defaultData})
}
