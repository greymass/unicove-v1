<script context="module">
    declare let window: any;
</script>

<script>
    import { BigNumber, ethers } from 'ethers';
    import type { EthAccount } from "../../../lib/evm";
    import Form from '~/components/elements/form.svelte'
    import Input from '~/components/elements/input.svelte'
    import Button from '~/components/elements/button.svelte'
    import Label from '~/components/elements/input/label.svelte'

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

    async function transferETHToEOS() {
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

    <Form on:submit={transferETHToEOS}>
        <Label>Transfer amount in ETH</Label>
        <Input bind:value={amount} />

        <Button>Transfer</Button>
    </Form>
</div>
