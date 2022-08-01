import type {Asset} from 'anchor-link'
import {derived} from 'svelte/store'
import type {Readable} from 'svelte/store'
import {accountProvider} from '~/stores/account-provider'

/** Current logged in users account data. */
export const currentAccount = derived(
    accountProvider,
    ($accountProvider) => $accountProvider.account
)

/** Current system token balance of current logged in user. */
export const currentAccountBalance: Readable<Asset | undefined> = derived(
    currentAccount,
    ($currentAccount) => {
        if ($currentAccount) {
            return $currentAccount.core_liquid_balance
        }
    }
)
