<script>
    import type { EthAccount } from "../utils/evm";

    export let ethAccount: EthAccount

    async function transferTokens() {
        const result = await this.web3.eth.sendTransaction({
            from: this.address,
            to: this.addressEvm,
            value: this.transferValue,
            gas: this.gas,
            data: this.bytesToHex(this.stringToUTF8Bytes(this.memo)),
        })
    }
</script>

<main>
    
</main>
