import { connectEvmWallet } from "../../lib/evm";
import { transferEvmToNative as transferEvmToEos, transferNativeToEvm as transferEosToEvm } from "../../lib/evm/eos";

export const transferTypes = {
    "evm-eos": {
        from: "evm",
        to: "eos",
        steps: {
            onPageLoad: connectEvmWallet,
            onConfirm: transferEvmToEos,
        }   
    },
    "eos-evm": {
        from: "eos",
        to: "evm",
        steps: {
            onPageLoad: connectEvmWallet,
            onConfirm: transferEosToEvm,
        }
    },
    "evm-telos": {
        from: "evm",
        to: "telos",
        steps: {
            onPageLoad: connectEvmWallet,
            onConfirm: transferEvmToNative,
        }
    },

    "telos-evm": {
        from: "telos",
        to: "evm",
        steps: {
            onPageLoad: connectEvmWallet,
            onConfirm: transferNativeToEvm,
        }
    },
}