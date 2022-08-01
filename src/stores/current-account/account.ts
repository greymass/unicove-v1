import {derived} from 'svelte/store'
import {accountProvider} from '~/stores/account-provider'

/** Current logged in users account data. */
export const currentAccount = derived(
    accountProvider,
    ($accountProvider) => $accountProvider.account
)
