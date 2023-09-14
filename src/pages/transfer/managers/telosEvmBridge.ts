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

        const actions = []

        if (!telosEvmAccount) {
            actions.push(this.telosEvmOpenWalletAction())
        }

        const action = Transfer.from({
            from: this.nativeSession.auth.actor,
            to: 'eosio.evm',
            quantity: String(Asset.fromFloat(Number(amount), '4,TLOS')),
            memo: this.evmSession.address || '',
        })

        actions.push({
            authorization: [this.nativeSession.auth],
            account: Name.from('eosio.token'),
            name: Name.from('transfer'),
            data: action,
        })

        return this.nativeSession.transact({
            actions
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

    telosEvmOpenWalletAction() {
        console.log({ address: this.evmSession.address })
        const action = TelosEvmOpenWallet.from({
            account: this.nativeSession.auth.actor,
            address: this.evmSession.address,
        })

        return {
            authorization: [this.nativeSession.auth],
            account: Name.from('eosio.evm'),
            name: Name.from('openwallet'),
            data: action,
        }
    }
}