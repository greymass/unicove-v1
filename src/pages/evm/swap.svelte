<script context="module">
    declare let window: any;
</script>

<script lang="ts">
    import {ethers} from 'ethers'
    import { writable } from 'svelte/store';
    import type { Writable } from 'svelte/store';

    import { activeSession } from '~/store'; 
    import Page from '~/components/layout/page.svelte';

    import Native from './swap/native.svelte';
    import EVM from './swap/evm.svelte';

    import { EthAccount } from "../../lib/evm";
    import Button from '~/components/elements/button.svelte'

    const ethAccount: Writable<EthAccount | null> = writable(null);
    let currentTab = 'native';
    let provider: ethers.providers.Web3Provider;

    async function switchNetwork() {
        await window.ethereum
            .request({
                method: 'wallet_switchEthereumChain',
                params: [{chainId: '0x4571'}],
            })
            .catch(async (e: { code: number }) => {
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
            ethAccount.set(EthAccount.from(await signer.getAddress()));
        } else {
            alert('You need to install Metamask');
        }
    }
</script>

<Page divider={false}>
    {#if $ethAccount && $activeSession}
        <div class="container">
            <h3>Connected EVM Account:</h3>
            <strong>{$ethAccount.ethAddress()}</strong>
            <hr />

            <div class="options">
                <Button
                    disabled={currentTab === 'native'}
                    on:action={() => (currentTab = 'native')}
                >
                    Swap EOS For Eth
                </Button>
                <Button
                    disabled={currentTab === 'evm'}
                    on:action={() => (currentTab = 'evm')}
                >
                    Swap Eth For EOS
                </Button>
            </div>

            {#if currentTab === 'native'}
            <main>
                <Native nativeSession={$activeSession} ethAccount={$ethAccount} />
            </main>
            {:else if currentTab === 'evm'}
            <main>
                <EVM nativeSession={$activeSession} ethAccount={$ethAccount} {provider} />
            </main>
            {/if}
        </div>
    {:else}
        <div class="container">
            <h3>Please connect your Ethereum wallet to access this page.</h3>
            <button on:click={connectWallet}>Connect EVM Wallet</button>
        </div>
    {/if}
</Page>

<style>
    .container {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        padding: 1em;
        text-align: center;
        padding: 100px;
    }

    h3 {
        margin-bottom: 2em;
    }

    strong {
        font-weight: bold;
    }

    hr {
        margin: 3em 0 1.5em 0;
    }

    .options {
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
