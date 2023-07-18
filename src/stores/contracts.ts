import {Contract, ContractKit} from '@wharfkit/contract'
import {Readable, derived} from 'svelte/store'
import {getClient} from '~/api-client'
import {activeBlockchain} from '~/store'

export const systemContract: Readable<Contract> = derived(
    [activeBlockchain],
    ([$activeBlockchain], set) => {
        if ($activeBlockchain) {
            const client = getClient($activeBlockchain)
            const kit = new ContractKit({
                client,
            })
            kit.load('eosio').then((contract) => set(contract))
        }
    }
)
