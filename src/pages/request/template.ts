import {derived} from 'svelte/store'
import type {Readable} from 'svelte/store'
import type {AnyAction} from '@greymass/eosio'

import {currentTransaction} from './request'

const templates = [
    {
        name: 'newaccount',
        actions: ['eosio::newaccount', 'eosio::buyrambytes'],
    },
]

export const currentTemplate: Readable<string> = derived(
    currentTransaction,
    ($currentTransaction: any) => {
        if ($currentTransaction) {
            const actions = $currentTransaction.actions.map(
                (action: AnyAction) => `${action.account}::${action.name}`
            )
            const matching = templates.find(
                (template) => JSON.stringify(template.actions) === JSON.stringify(actions)
            )
            if (matching) {
                return matching.name
            }
            return 'default'
        }
        return 'loading'
    }
)
