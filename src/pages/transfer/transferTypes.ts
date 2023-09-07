import { connectEvmWallet, transferEvmToNative, transferNativeToEvm } from "../../lib/evm/eos";

export const transferTypes = {
    "evm-eos": {
        from: "evm",
        to: "eos",
        steps: {
            onSelect: connectEvmWallet,
            onConfirm: transferEvmToNative,
        }   
    },
    "eos-evm": {
        from: "eos",
        to: "evm",
        steps: {
            onSelect: connectEvmWallet,
            onConfirm: transferNativeToEvm,
        }
    },
    "evm-telos": {},
    "telos-evm": {},
}