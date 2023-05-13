<script lang="ts">
    import { ethers } from 'ethers';
    import { writable } from 'svelte/store';

    import { Transfer } from '~/utils/evm';
    import Native from './native.svelte';
    import EVM from './evm.svelte';

    import {Transfer} from '~/abi-types'

    export let ethAccount 
    export let nativeSession

    let quantity = 0;

    async function transfer() {
        const action = Transfer.from({
            from: $activeSession.auth.actor,
            to: "eosio.evm",
            quantity,
            memo: ethAccount.toEOSAddress(),
        });

        const result = await $activeSession.transact({
            action: {
                authorization: [$activeSession.auth],
                account: 'eosio.token',
                name: 'EOS',
                data: action,
            },
        });
    }
</script>

<div class="container">
    <!-- Add your tabs and content here -->

    <form on:submit|preventDefault={transfer}>
        <label for="quantity">Quantity:</label>
        <input type="number" id="quantity" bind:value={quantity} min="0" step="0.0001" required>
        <button type="submit">Transfer</button>
    </form>
</div>

