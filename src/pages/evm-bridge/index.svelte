<script context="module">
    declare let window: any;
</script>

<script lang="ts">
    import { writable } from 'svelte/store';
    import Native from './native.svelte';
    import EVM from './evm.svelte';

    const ethAccount = writable(null);
    let currentTab = 'native';

    async function switchNetwork() {
        await window.ethereum
            .request({
                method: 'wallet_switchEthereumChain',
                params: [{chainId: '0x4571'}],
            })
            .catch(async (e) => {
                if (e.code === 4902) {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [
                            {
                                chainId: '0x4571',
                                chainName: 'EOS EVM Network',
                                nativeCurrency: {name: 'EOS', symbol: 'EOS', decimals: 18},
                                rpcUrls: ['https://api.evm.eosnetwork.com/'],
                                blockExplorerUrls: ['https://explorer.evm.eosnetwork.com'],
                            },
                        ],
                    });
                }
            });
    }

    async function connectWallet() {
        if (window.ethereum) {
            provider = new ethers.providers.Web3Provider(window.ethereum);
            let networkId = await provider.getNetwork();
            if (networkId.chainId !== 17777) {
                await switchNetwork();
                networkId = await provider.getNetwork();
            }

            await window.ethereum.request({method: 'eth_requestAccounts'});
            const signer = provider.getSigner();
            ethAccount.set(await signer.getAddress());
        } else {
            alert('You need to install Metamask');
        }
    }
</script>

{#if $ethAccount}
<div class="container">
    <div class="tabs">
        <button class:active={currentTab === 'native'} on:click={() => currentTab = 'native'}>Swap ETH for EOS</button>
        <button class:active={currentTab === 'evm'} on:click={() => currentTab = 'evm'}>Swap EOS for ETH</button>
    </div>

    {#if currentTab === 'native'}
    <main>
        <Native />
    </main>
    {:else if currentTab === 'evm'}
    <main>
        <EVM />
    </main>
    {/if}
</div>
{:else}
<div class="container">
    Please connect your Ethereum wallet to access this page.
    <button on:click={connectWallet}>Connect Wallet</button>
</div>
{/if}

<style>
    .container {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        padding: 1em;
    }

    .tabs {
        display: flex;
        justify-content: space-between;
        margin-bottom: 2em;
    }

    button {
        padding: 0.5em 1em;
        font-size: 1em;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    button:hover {
        background-color: #ddd;
    }

    button.active {
        background-color: #aaa;
    }
</style>
