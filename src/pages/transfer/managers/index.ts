import { EvmTelosBridge } from "./evmTelosBridge";
import { EosEvmBridge } from "./eosEvmBridge";
import { EvmEosBridge } from "./evmEosBridge";
import { TelosEvmBridge } from "./telosEvmBridge";
import type { TransferManager } from "./transferManager";

export const transferManagers: {[key: string]: typeof TransferManager} = {
    "EOS - EOS (EVM)": EosEvmBridge,
    "EOS (EVM) - EOS": EvmEosBridge,
    "TLOS - TLOS (EVM)": TelosEvmBridge,
    "TLOS (EVM) - TLOS": EvmTelosBridge,
}
