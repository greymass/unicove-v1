<script context="module">
    declare let window: any
</script>

<script lang="ts">
    import {writable} from 'svelte/store'
    import type {Writable} from 'svelte/store'
    import {activeSession} from '~/store'

    import Label from '~/components/elements/input/label.svelte'
    import Input from '~/components/elements/input.svelte'
    import Page from '~/components/layout/page.svelte'
    import Form from '~/components/elements/form.svelte'
    import Button from '~/components/elements/button.svelte'

    import {EthAccount, transferEOSToEth, transferETHToEOS, connectEthWallet} from '~/lib/evm'

    const ethAccount: Writable<EthAccount | null> = writable(null)

    let amount = '0.0000';
        
    let transferOption = 'eosToEth'

    function handleChange(event: Event) {
        const target = event.target as HTMLSelectElement;
        transferOption = target.value;
    }

    async function transfer() {
        const ethWalletAccount = await connectEthWallet()
        if (!ethWalletAccount) {
            throw new Error('Could not connect to ETH wallet.')
        }
        ethAccount.set(ethWalletAccount)

        if (transferOption === 'eosToEth') {
            transferEOSToEth({ nativeSession: $activeSession!, ethAccount: ethWalletAccount, amount })
        } else {
            transferETHToEOS({ nativeSession: $activeSession!, ethAccount: ethWalletAccount, amount })
        }
    }
</script>

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

<Page divider={false}>
    <div class="container">
        <Form on:submit={transfer}>
            <div class="left-section">
                <!-- <Selector bind:value={token} /> -->
                <Label>Amount</Label>
                <Input bind:value={amount} />
            </div>
            <div class="right-section">
                <select bind:value={transferOption} on:change={handleChange}>
                    <option value="">Select an option...</option>
                    <option value="eosToEth">EOS (Native)</option>
                    <option value="ethToEos">EOS (EVM)</option>
                </select>
            </div>
            <Button on:action={transfer}>Continue</Button>
            <Button>Continue</Button>
        </Form>
    </div>
</Page>
