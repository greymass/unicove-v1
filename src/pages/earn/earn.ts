import {writable} from 'svelte/store'

import type {Asset} from '@greymass/eosio'

export const enum Step {
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

export const earnData = writable<EarnData>({step: Step.Overview})
