import { EvmTelosBridge } from "./evmTelosBridge";
import { EosEvmBridge } from "./eosEvmBridge";
import { EvmEosBridge } from "./evmEosBridge";
import { TelosEvmBridge } from "./telosEvmBridge";
import type { TransferManager } from "./transferManager";
import type { EvmSession as EosEvmSession } from '~/lib/evm/eos'
import type { EvmSession as TelosEvmSession } from '~/lib/evm/telos'

export const transferManagers: {[key: string]: typeof TransferManager<EosEvmSession | TelosEvmSession>} = {
    "EOS - EOS (EVM)": EosEvmBridge,
    "EOS (EVM) - EOS": EvmEosBridge,
    "TLOS - TLOS (EVM)": TelosEvmBridge,
    "TLOS (EVM) - TLOS": EvmTelosBridge,
}
