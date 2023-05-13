<script>
    import type { EthAccount } from "../utils/evm";

    export let nativeSession
    export let ethAccount: EthAccount

    let targetAddress = '';
    let amount = '';
    let gas = '';
    let transactionHash = '';
    let transactionError = '';
    let submitting = false;
    let finished = false;

    async function transferNativeToEOS() {
        try {
            submitting = true;
            transactionHash = '';
            if (!window.confirm(`You are going to transfer ${amount} EOS to ${targetAddress}`)) {
                return;
            }
            gas = await provider.estimateGas({
                from: $ethAccount.ethAddress(),
                to: "eosio.evm",
                value: ethers.utils.parseEther(amount),
                gasPrice: await provider.getGasPrice(),
                data: ethers.utils.formatBytes32String(''), // replace '' with your memo if needed
            });
            const result = await provider.sendTransaction({
                from: $ethAccount.ethAddress(),
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
        <label for="targetAddress">Target EOS Address:</label>
        <input type="text" id="targetAddress" bind:value={targetAddress} required>

        <label for="amount">Amount:</label>
        <input type="number" id="amount" bind:value={amount} min="0" step="0.0001" required>

        <button type="submit">Transfer</button>
    </form>
</div>


<style>
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 2em;
        background-color: #f5f5f5;
    }

    form {
        display: flex;
        flex-direction: column;
        align-items: start;
        gap: 1em;
        padding: 1em;
        background-color: white;
        border: 1px solid #ddd;
        border-radius: 5px;
        margin-bottom: 1em;
    }

    label {
        font-size: 1em;
        font-weight: 600;
    }

    input {
        padding: 0.5em;
        border: 1px solid #ddd;
        border-radius: 5px;
    }

    button {
        padding: 0.5em 1em;
        border: none;
        border-radius: 5px;
        background-color: #007bff;
        color: white;
        cursor: pointer;
    }

    button:hover {
        background-color: #0056b3;
    }
</style>