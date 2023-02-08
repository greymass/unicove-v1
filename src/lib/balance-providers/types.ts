import type {Name} from 'anchor-link'

import type {Balance} from '~/stores/balances'

// Available Balance Providers
export enum BalanceProviders {
    Bloks,
    LightAPI,
}

export interface BalanceProvider {
    fetchBalances: (account: Name) => Promise<Balance[]>
}
