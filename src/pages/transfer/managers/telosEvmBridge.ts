import { get } from "svelte/store";

import { currentAccountBalance } from "~/store";
import { TransferManager } from "./transferManager";
import { TelosEvmOpenWallet, Transfer } from "~/abi-types";
import { Asset, Name } from "anchor-link";
import { updateActiveAccount } from "~/stores/account-provider";
import { updateEvmBalance } from "~/stores/balances-provider";
import { getTelosEvmAccount } from "~/lib/evm";

export class TelosEvmBridge extends TransferManager {
    static from = "telos"
    static fromDisplayString = "TLOS"
    static to = "evm"
    static toDisplayString = "TLOS (EVM)"
    static supportedChains = ["telos"]
    static evmRequired = true;

    get fromAddress() {
        return String(this.nativeSession.auth.actor)
    }

    get toAddress() {
        return this.evmSession.address
    }

    async transfer(amount: string) {
        const telosEvmAccount = await getTelosEvmAccount(this.nativeSession.auth.actor)

        if (!telosEvmAccount) {
            this.createNewTelosEvmAccount()
        }

        const action = Transfer.from({
            from: this.nativeSession.auth.actor,
            to: 'eosio.evm',
            quantity: String(Asset.fromFloat(Number(amount), '4,TLOS')),
            memo: this.evmSession.address || '',
        })

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

    createNewTelosEvmAccount() {
        const action = TelosEvmOpenWallet.from({
            account: this.nativeSession.auth.actor,
            address: this.evmSession.address,
        })

        this.nativeSession.transact({
            action: {
                authorization: [this.nativeSession.auth],
                account: Name.from('eosio.evm'),
                name: Name.from('openwallet'),
                data: action,
            },
        })

    }
}