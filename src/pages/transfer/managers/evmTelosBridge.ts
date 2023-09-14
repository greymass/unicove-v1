import { get } from "svelte/store";

import { evmBalance } from "~/store";
import { TransferManager } from "./transferManager";
import { Asset, Name } from "anchor-link";
import { TelosEvmWithdraw } from "~/abi-types";
import { systemToken } from "~/stores/tokens";
import { updateActiveAccount } from "~/stores/account-provider";
import { updateEvmBalance } from "~/stores/balances-provider";

export class EvmTelosBridge extends TransferManager {
    static from = "evm"
    static fromDisplayString = "TLOS (EVM)"
    static to = "telos"
    static toDisplayString = "TLOS"
    static supportedChains = ["telos"]
    static evmRequired = true;

    get fromAddress() {
        return this.evmSession.address!
    }

    get toAddress() {
        return String(this.nativeSession.auth.actor)
    }

    async transfer(amount: string) {
        const systemTokenSymbol = get(systemToken)?.symbol

        if (!systemTokenSymbol) {
            throw new Error('No system token symbol found')
        }

        const action = TelosEvmWithdraw.from({
            to: this.nativeSession.auth.actor,
            quantity: String(Asset.fromFloat(Number(amount), systemTokenSymbol)),
        })
    
        return this.nativeSession.transact({
            action: {
                authorization: [this.nativeSession.auth],
                account: Name.from('eosio.evm'),
                name: Name.from('withdraw'),
                data: action,
            },
        }) 
    }

    async balance() {
        return get(evmBalance)
    }

    async updateBalances(): Promise<void> {
        await Promise.all([
            updateActiveAccount(),
            updateEvmBalance(),
        ])
    }

    updateMainBalance() {
        return updateEvmBalance()
    }
}