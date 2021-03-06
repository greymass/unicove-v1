import type {Asset} from 'anchor-link'

export interface TokensData {
    name: string,
    balance: Asset,
    usdValue: number,
}
