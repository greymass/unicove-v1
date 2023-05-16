<script lang="ts">
    import type { LinkSession } from 'anchor-link'

    import { Transfer } from '~/abi-types';
    import Form from '~/components/elements/form.svelte'
    import Input from '~/components/elements/input.svelte'
    import Button from '~/components/elements/button.svelte'

    import type { EthAccount } from '~/lib/evm'
    import Label from '~/components/elements/input/label.svelte'

    export let ethAccount: EthAccount
    export let nativeSession: LinkSession

    let amount = '0.0000';

    async function transferETHToEOS() {
        const action = Transfer.from({
            from: nativeSession.auth.actor,
            to: "eosio.evm",
            quantity: Number(amount),
            memo: ethAccount.ethAddress(),
        });

        let result;

        try {
            result = await nativeSession.transact({
                action: {
                    authorization: [nativeSession.auth],
                    account: 'eosio.token',
                    name: 'EOS',
                    data: action,
                },
            });
        } catch (error) {
            throw new Error(`Transaction failed: ${error}`)
        }
        
        alert(`Transaction executed.\n\n ID: ${result.transaction}`)
    }
</script>

<div class="container">
    <!-- Add your tabs and content here -->

    <Form on:submit={transferETHToEOS}>
        <Label>Transfer amount in EOS</Label>
        <Input bind:value={amount} />
        <Button>Transfer</Button>
    </Form>
</div>

