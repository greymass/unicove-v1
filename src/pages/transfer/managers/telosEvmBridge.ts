import { get } from "svelte/store";

import { currentAccountBalance } from "~/store";
import { TransferManager } from "./transferManager";

export class TelosEvmBridge extends TransferManager {
    static from = "telos"
    static fromDisplayString = "TLOS"
    static to = "evm"
    static toDisplayString = "TLOS (EVM)"
    static supportedChains = ["telos"]

    async balance() {
        return get(currentAccountBalance)
    }
}