<script context="module">
    declare let window: any;
</script>

<script>
    import { BigNumber, ethers } from 'ethers';
    import type { EthAccount } from "../../../lib/evm";

    export let nativeSession
    export let ethAccount: EthAccount
    export let provider: ethers.providers.Web3Provider

    let targetAddress = '';
    let amount = '';
    let gas: BigNumber | undefined;
    let transactionHash = '';
    let transactionError = '';
    let submitting = false;
    let finished = false;

    const signer = provider.getSigner();

    async function transferNativeToEOS() {
        try {
            submitting = true;
            transactionHash = '';
            if (!window.confirm(`You are going to transfer ${amount} EOS to ${targetAddress}`)) {
                return;
            }
            gas = await provider.estimateGas({
                from: ethAccount.ethAddress(),
                to: "eosio.evm",
                value: ethers.utils.parseEther(amount),
                gasPrice: await provider.getGasPrice(),
                data: ethers.utils.formatBytes32String(''), // replace '' with your memo if needed
            });
            const result = await signer.sendTransaction({
                from: ethAccount.ethAddress(),
                to: "eosio.evm",
                value: ethers.utils.parseEther(amount),
                gasPrice: await provider.getGasPrice(),
                gasLimit: gas,
                data: ethers.utils.formatBytes32String(''), // replace '' with your memo if needed
            });
            transactionHash = result.hash;
            amount = '';
            targetAddress = '';
            finished = true;
            setTimeout(() => {
                finished = false;
            }, 2000);
        } catch (err) {
            console.error(err);
            transactionError = err.message;
        } finally {
            submitting = false;
        }
    }
</script>

<div class="container">
    <!-- Add your tabs and content here -->

    <form on:submit|preventDefault={transferNativeToEOS}>
        <label for="amount">Amount:</label>
        <input type="number" id="amount" bind:value={amount} min="0" step="0.0001" required>

        <button type="submit">Transfer</button>
    </form>
</div>
