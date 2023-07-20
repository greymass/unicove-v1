<script lang="ts">
    import {Asset as CoreAsset} from '@greymass/eosio'
    import {currentAccountBalance, evmAccount} from '~/store'

    import Label from '~/components/elements/input/label.svelte'
    import Form from '~/components/elements/form.svelte'
    import Button from '~/components/elements/button.svelte'
    import Select from '~/components/elements/select.svelte'
    import Asset from '~/components/elements/input/asset.svelte'

    export let handleContinue: () => void
    export let amount: string = '0.0001'
    export let transferOption: string = 'nativeToEvm'

    let evmBalance: CoreAsset | undefined
    let validAmount = false

    function handleSelectChange(event: CustomEvent) {
        transferOption = event.detail

        amount = ''
    }

    function useEntireBalance() {
        if (transferOption === 'nativeToEvm') {
            amount = $currentAccountBalance?.value.toFixed(4) || '0.0000'
        } else {
            amount = evmBalance?.value.toFixed(4) || '0.0000'
        }
    }

    function onContinue() {
        if (validAmount) {
            handleContinue()
        }
    }

    $: {
        $evmAccount?.getBalance().then((balance) => {
            evmBalance = CoreAsset.from(Number(balance.split(' ')[0]), '4,EOS')
        })
    }

    $: nativeToEVMLabel = `Native (${$currentAccountBalance})`
    $: evmToNativeLabel = `EVM (${evmBalance ? evmBalance : 'not connected'})`
</script>

<style type="scss">
    .container {
        width: 100%;
        margin: 0 auto;
        padding: 1em;
        text-align: center;

        .top-section {
            padding: 10px;

            h1 {
                margin-bottom: 10px;
            }
        }
        .middle-section {
            display: flex;
            justify-content: space-between;

            .left-section,
            .right-section {
                border: 2px solid var(--main-grey);
                border-radius: 10px;
                width: 44%; /* or set a flex-basis instead */
                margin: 3%;
                padding: 20px;

                button {
                    cursor: pointer;
                    color: var(--main-blue);
                    font-size: 0.7em;
                    margin: 10px 15px;
                    display: block;
                    float: right;
                    font-weight: bold;
                    text-transform: uppercase;
                    background: none;
                    border: none;
                    padding: 0;
                }
            }
        }

        .bottom-section {
            padding: 30px;
            max-width: 350px;
            margin: auto;

            h3 {
                margin: 5px;
            }
        }
    }
</style>

<div class="container">
    <div class="top-section">
        <h1>Transfer</h1>
        <h3>Select your accounts and amount</h3>
    </div>
    <Form>
        <div class="middle-section">
            <div class="left-section">
                <Label align="left">From</Label>
                <Select
                    bind:value={transferOption}
                    on:change={handleSelectChange}
                    options={[
                        {value: 'nativeToEvm', label: nativeToEVMLabel},
                        {value: 'evmToNative', label: evmToNativeLabel},
                    ]}
                    fluid
                />
                <Label align="left">Amount</Label>
                <Asset
                    fluid
                    placeholder="0.0000"
                    balance={transferOption === 'nativeToEvm' ? $currentAccountBalance : evmBalance}
                    bind:valid={validAmount}
                    bind:value={amount}
                />
                <button on:click={useEntireBalance}> Entire Balance </button>
            </div>
            <div class="right-section">
                <Label align="left">To</Label>
                <Select
                    bind:value={transferOption}
                    on:change={handleSelectChange}
                    options={[
                        {value: 'nativeToEvm', label: evmToNativeLabel},
                        {value: 'evmToNative', label: nativeToEVMLabel},
                    ]}
                    fluid
                />
            </div>
        </div>
        <div class="bottom-section">
            <Button fluid style="primary" disabled={!validAmount} on:action={onContinue}
                >Continue</Button
            >
            {#if !$evmAccount}
                <h3>
                    Connect to metamask wallet to continue
                </h3>
            {/if}
        </div>
    </Form>
</div>
