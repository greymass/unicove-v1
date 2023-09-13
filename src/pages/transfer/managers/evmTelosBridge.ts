import { get } from "svelte/store";

import { currentAccountBalance } from "~/store";
import { TransferManager } from "./transferManager";
import { Asset, Name } from "anchor-link";
import { TelosEvmWithdraw } from "~/abi-types";
import { systemToken } from "~/stores/tokens";

export class EvmTelosBridge extends TransferManager {
    static from = "evm"
    static fromDisplayString = "TLOS (EVM)"
    static to = "telos"
    static toDisplayString = "TLOS"
    static supportedChains = ["telos"]

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
        return get(currentAccountBalance)
    }
}