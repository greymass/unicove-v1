import { get } from "svelte/store";

import { currentAccountBalance } from "~/store";
import { TransferManager } from "./transferManager";

export class EvmTelosBridge extends TransferManager {
    static from = "evm"
    static fromDisplayString = "TLOS (EVM)"
    static to = "telos"
    static toDisplayString = "TLOS"
    static supportedChains = ["evm"]

    // TODO: Implement methods

    async balance() {
        return get(currentAccountBalance)
    }
}