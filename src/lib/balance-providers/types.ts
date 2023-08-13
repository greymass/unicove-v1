import type {Name} from '@wharfkit/antelope'

import type {Balance} from '~/stores/balances'

// Available Balance Providers
export enum BalanceProviders {
    Bloks,
    LightAPI,
}

export interface BalanceProvider {
    fetchBalances: (account: Name) => Promise<Balance[]>
}
