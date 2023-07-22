<script lang="ts">
    import {Asset as CoreAsset} from '@greymass/eosio'
    import {currentAccountBalance, evmAccount, activeSession} from '~/store'

    import Label from '~/components/elements/input/label.svelte'
    import Form from '~/components/elements/form.svelte'
    import Button from '~/components/elements/button.svelte'
    import Select from '~/components/elements/select.svelte'
    import Asset from '~/components/elements/input/asset.svelte'

    export let handleContinue: () => void
    export let amount: string = '0.0001'
    export let from: string | undefined
    export let to: string | undefined

    let evmBalance: CoreAsset | undefined
    let validAmount = false

    function handleFromChange(event: CustomEvent) {
        from = event.detail
        to = undefined

        amount = ''
    }

    function handleToChange(event: CustomEvent) {
        to = event.detail
    }

    function useEntireBalance() {
        if (from === 'evm') {
            amount = $currentAccountBalance?.value.toFixed(4) || '0.0000'
        } else if (from === 'native') {
            amount = evmBalance?.value.toFixed(4) || '0.0000'
        }
    }

    function onContinue() {
        if (validAmount) {
            handleContinue()
        }
    }

    function resetForm() {
        from = undefined
        to = undefined
        amount = ''
    }

    $: {
        if ($activeSession?.identifier) {
            resetForm()
        }
    }

    $: {
        $evmAccount?.getBalance().then((balance) => {
            evmBalance = CoreAsset.from(Number(balance.split(' ')[0]), '4,EOS')
        })
    }

    $: nativeLabel = `Native (${$currentAccountBalance})`
    $: evmLabel = `EVM (${evmBalance ? evmBalance : 'not connected'})`
    
    $: fromOptions = [
        {value: 'Native', label: nativeLabel},
        {value: 'EVM', label: evmLabel},
    ]

    const toOptions: {value:string, label:string}[] = []

    $: {
        if (to === 'Native') {
            toOptions.push({value: 'EVM', label: evmLabel})
        } else if (to === 'EVM') {
            toOptions.push({value: 'Native', label: nativeLabel})
        } else {
            toOptions.push(
                {value: 'Native', label: nativeLabel},
                {value: 'EVM', label: evmLabel},
            )
        }
    }

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
        <h3>Transfer tokens between your accounts</h3>
    </div>
    <Form>
        <div class="middle-section">
            <div class="left-section">
                <Label align="left">From</Label>
                <Select
                    bind:value={from}
                    on:change={handleFromChange}
                    options={fromOptions}
                    fluid
                />
                <Label align="left">Amount</Label>
                <Asset
                    fluid
                    placeholder="0.0000"
                    balance={from === 'Native' ? $currentAccountBalance : evmBalance}
                    bind:valid={validAmount}
                    bind:value={amount}
                />
                <button on:click={useEntireBalance}>Entire Balance</button>
            </div>
            <div class="right-section">
                <Label align="left">To</Label>
                <Select
                    bind:value={to}
                    on:change={handleToChange}
                    options={toOptions}
                    fluid
                />
            </div>
        </div>
        <div class="bottom-section">
            <Button fluid style="primary" disabled={!validAmount || !$evmAccount} on:action={onContinue}
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
