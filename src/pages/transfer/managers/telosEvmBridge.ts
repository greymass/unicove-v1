import { get } from "svelte/store";

import { currentAccountBalance } from "~/store";
import { TransferManager } from "./transferManager";
import { Transfer } from "~/abi-types";
import { Asset, Name } from "anchor-link";
import { updateActiveAccount } from "~/stores/account-provider";
import { updateEvmBalance } from "~/stores/balances-provider";

export class TelosEvmBridge extends TransferManager {
    static from = "telos"
    static fromDisplayString = "TLOS"
    static to = "evm"
    static toDisplayString = "TLOS (EVM)"
    static supportedChains = ["telos"]
    static evmRequired = false;

    get fromAddress() {
        return String(this.nativeSession.auth.actor)
    }

    get toAddress() {
        return this.evmSession.address || 'Address will be created after first transfer'
    }

    async transfer(amount: string) {
        const action = Transfer.from({
            from: this.nativeSession.auth.actor,
            to: 'eosio.evm',
            quantity: String(Asset.fromFloat(Number(amount), '4,TLOS')),
            memo: this.evmSession.address || '',
        })

        console.log({auth: this.nativeSession.auth})

        return this.nativeSession.transact({
            action: {
                authorization: [this.nativeSession.auth],
                account: Name.from('eosio.token'),
                name: Name.from('transfer'),
                data: action,
            },
        })
    }

    async balance() {
        return get(currentAccountBalance)
    }

    async updateMainBalance() {
        return updateEvmBalance()
    }

    async updateBalances(): Promise<void> {
        await Promise.all([
            updateActiveAccount(),
            updateEvmBalance(),
        ])
    }
}