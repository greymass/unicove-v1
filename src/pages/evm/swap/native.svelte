<script lang="ts">
    import type { LinkSession } from 'anchor-link'

    import { Transfer } from '~/abi-types';
    import Native from './native.svelte';
    import EVM from './evm.svelte';
    import type { EthAccount } from '~/lib/evm'


    export let ethAccount: EthAccount
    export let nativeSession: LinkSession

    let quantity = 0;

    async function nativeToEvmTransfer() {
        const action = Transfer.from({
            from: nativeSession.auth.actor,
            to: "eosio.evm",
            quantity,
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

    <form on:submit|preventDefault={nativeToEvmTransfer}>
        <label for="quantity">Quantity:</label>
        <input type="number" id="quantity" bind:value={quantity} min="0" step="0.0001" required>
        <button type="submit">Transfer</button>
    </form>
</div>

