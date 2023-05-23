<script context="module">
    declare let window: any;
</script>

<script>
    import { BigNumber, ethers } from 'ethers';
    import type { LinkSession } from 'anchor-link'
    import type { EthAccount } from "../../../lib/evm";
    import { convertToEvmAddress } from '../../../lib/evm';
    import Form from '~/components/elements/form.svelte'
    import Input from '~/components/elements/input.svelte'
    import Button from '~/components/elements/button.svelte'
    import Label from '~/components/elements/input/label.svelte'

    export let nativeSession: LinkSession
    export let ethAccount: EthAccount
    export let provider: ethers.providers.Web3Provider

    let amount = '0.0000';
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
            if (!window.confirm(`You are going to transfer ${amount} EOS to ${ethAccount.ethAddress()}`)) {
                return;
            }
            const targetEvmAddress = convertToEvmAddress(String(nativeSession.auth.actor));

            gas = await provider.estimateGas({
                from: ethAccount.ethAddress(),
                to: targetEvmAddress,
                value: ethers.utils.parseEther(amount),
                gasPrice: await provider.getGasPrice(),
                data: ethers.utils.formatBytes32String(''),
            });
            const result = await signer.sendTransaction({
                from: ethAccount.ethAddress(),
                to: targetEvmAddress,
                value: ethers.utils.parseEther(amount),
                gasPrice: await provider.getGasPrice(),
                gasLimit: gas,
                data: ethers.utils.formatBytes32String(''),
            });
            transactionHash = result.hash;

            window.alert(`Transaction executed.\n\n ID: ${transactionHash}`);
            amount = '0.0000';
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
    <Form on:submit={transferETHToEOS}>
        <Label>Transfer amount in ETH</Label>
        <Input bind:value={amount} />

        <Button on:action={transferETHToEOS}>Transfer</Button>
    </Form>
</div>
