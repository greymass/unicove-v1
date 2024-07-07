import type {Asset} from 'anchor-link'

export const enum Step {
    Bootstrap,
    Overview,
    Stake,
    Unstake,
    Claim,
    Confirm,
    Success,
    Error,
}

export interface REXInfo {
    total: Asset
    savings: Asset
    matured: Asset
    apy: string
}
