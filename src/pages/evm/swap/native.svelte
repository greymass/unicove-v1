<script lang="ts">
    import { LinkSession, Name } from 'anchor-link'
    import { getContext } from 'svelte'
    import {Asset} from '@greymass/eosio'
    
    import type {FormTransaction} from '~/ui-types'
    import { Transfer } from '~/abi-types';
    import Form from '~/components/elements/form.svelte'
    import Input from '~/components/elements/input.svelte'
    import Button from '~/components/elements/button.svelte'

    import type { EthAccount } from '~/lib/evm'
    import Label from '~/components/elements/input/label.svelte'

    export let ethAccount: EthAccount
    export let nativeSession: LinkSession

    const context: FormTransaction = getContext('transaction')

    let amount = '0.0000';

    async function transferETHToEOS() {
        const action = Transfer.from({
            from: nativeSession.auth.actor,
            to: "eosio.evm",
            quantity: String(Asset.fromFloat(Number(amount), '4,EOS')),
            memo: ethAccount.ethAddress(),
        });

        let result;

        console.log({ asset: String(Asset.fromFloat(Number(amount), '4,EOS'))})

        try {
            result = await nativeSession.transact({
                action: {
                    authorization: [nativeSession.auth],
                    account: Name.from('eosio.token'),
                    name: Name.from('transfer'),
                    data: action,
                },
            });

            if (context) {
                // Pass the transaction ID to the parent
                const txid = String(result.transaction.id)
                context.setTransaction(txid)
            }
        } catch (error) {
            console.log({error})
            throw new Error(`Transaction failed: ${error}`)
        }
        
        alert(`Transaction executed.\n\n ID: ${result.transaction.id}`)
    }
</script>

<div class="container">
    <Form on:submit={transferETHToEOS}>
        <Label>Transfer amount in EOS</Label>
        <Input bind:value={amount} />
        <Button on:action={transferETHToEOS}>Transfer</Button>
    </Form>
</div>

