import {Asset} from 'anchor-link'
import {derived} from 'svelte/store'
import type {Readable} from 'svelte/store'

import {activeBlockchain, activePriceTicker} from '~/store'
import {currentAccount} from './account'
import {currentDelegatedTokens} from './delegated'
import {currentREXBalance} from './rex'
import {balances} from '~/stores/balances'
import {getToken, systemTokenKey} from '~/stores/tokens'

/** Current liquid system token balance of the logged in user. */
export const currentLiquidBalance: Readable<Asset | undefined> = derived(
    currentAccount,
    ($currentAccount) => {
        if ($currentAccount) {
            return $currentAccount.core_liquid_balance
        }
    }
)

/** Current system token balance of the logged in user. */
export const currentAccountBalance: Readable<Asset> = derived(
    [activeBlockchain, currentLiquidBalance, currentDelegatedTokens, currentREXBalance],
    ([$blockchain, $account, $delegated, $rex]) => {
        let amount = 0
        if ($account) {
            amount += $account.value
        }
        if ($delegated) {
            amount += $delegated.value
        }
        if ($rex) {
            amount += $rex.value
        }
        return Asset.from(amount, $blockchain.coreTokenSymbol)
    }
)

/** Current value of all tokens of the logged in user. */
export const currentAccountValue: Readable<number> = derived(
    [balances, currentAccount, currentAccountBalance, activePriceTicker, systemTokenKey],
    ([$balances, $currentAccount, $currentAccountBalance, $price, $systemTokenKey]) => {
        let value = 0
        if ($currentAccount && $price !== undefined) {
            if ($currentAccountBalance) {
                value += $currentAccountBalance.value * $price
            }
            if ($balances) {
                $balances
                    // Ensure the records match the current account
                    .filter((record) => record.account.equals($currentAccount.account_name))
                    // Exclude the system token since it's already part of currentAccountBalance
                    .filter((record) => record.tokenKey !== String($systemTokenKey))
                    .map((record) => {
                        const token = getToken(record.tokenKey)
                        if (token && token.price) {
                            value += record.quantity.value * token.price
                        }
                    })
            }
        }
        return value
    }
)
