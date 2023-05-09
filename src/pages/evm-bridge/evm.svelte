<script>
    import {ethers} from 'ethers'
    import {onMount} from 'svelte'

    import {writable} from 'svelte/store'

    const ethAccount = writable()

    declare let window: any;

     async transferTokens() {
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
    <div>Connected Account: {$ethAccount}</div>
    <button on:click={connectWallet}>Connect wallet</button>
</main>
