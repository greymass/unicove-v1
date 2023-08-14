<script lang="ts">
    import {Asset as CoreAsset} from '@greymass/eosio'
    import {currentAccountBalance, evmAccount, activeSession} from '~/store'
    import {Token, systemToken} from '~/stores/tokens'

    import Label from '~/components/elements/input/label.svelte'
    import Form from '~/components/elements/form.svelte'
    import Button from '~/components/elements/button.svelte'
    import Asset from '~/components/elements/input/asset.svelte'
    import Selector from '~/components/elements/input/token/selector.svelte'

    export let handleContinue: () => void
    export let amount: string = ''
    export let from: Token | undefined
    export let to: Token | undefined

    let evmBalance: CoreAsset | undefined
    let validAmount = false

    function handleFromChange(token: Token) {
        from = token
        to = undefined

        amount = ''
    }

    function handleToChange(token: Token) {
        to = token
    }

    function useEntireBalance() {
        if (from?.name === 'EOS (EVM)') {
            amount = evmBalance?.value.toFixed(4) || '0.0000'
        } else if (from?.name === 'EOS') {
            amount = $currentAccountBalance?.value.toFixed(4) || '0.0000'
        }
    }

    $: readyToContinue = from && to && validAmount && $evmAccount

    function onContinue() {
        if (readyToContinue) {
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

    let fromOptions: Token[] = []
    let toOptions: Token[] = []

    $: {
        if ($systemToken) {
            const evmToken = {
                ...$systemToken,
                name: 'EOS (EVM)',
                contract: 'eosio.evm',
                balance: evmBalance || 'Connect',
            }
            fromOptions = [$systemToken, evmToken]
            if (from?.name === 'EOS (EVM)') {
                toOptions = [$systemToken]
            } else if (from?.name === 'EOS') {
                toOptions = [evmToken]
            } else {
                toOptions = fromOptions
            }
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

                .selector-container {
                    margin-bottom: 15px;
                }
            }

            /* Media Query for Mobile */
            @media screen and (max-width: 768px) {
                flex-direction: column;

                .left-section,
                .right-section {
                    width: 90%; /* Adjust width for mobile */
                    margin: 3% auto; /* Centers the sections */
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
                <div class="selector-container">
                    <Selector
                        onTokenSelect={handleFromChange}
                        selectedToken={from}
                        tokenOptions={fromOptions}
                    />
                </div>
                <Label align="left">Amount</Label>
                <Asset
                    fluid
                    placeholder="0.0000"
                    balance={from?.name === 'EOS' ? $currentAccountBalance : evmBalance}
                    bind:valid={validAmount}
                    bind:value={amount}
                />
                <button on:click={useEntireBalance}>Entire Balance</button>
            </div>
            <div class="right-section">
                <Label align="left">To</Label>
                <div class="selector-container">
                    <Selector
                        onTokenSelect={handleToChange}
                        selectedToken={to}
                        tokenOptions={toOptions}
                    />
                </div>
            </div>
        </div>
        <div class="bottom-section">
            <Button
                fluid
                style="primary"
                disabled={!readyToContinue}
                on:action={onContinue}>Continue</Button
            >
            {#if !$evmAccount}
                <h3>Connect to metamask wallet to continue</h3>
            {/if}
        </div>
    </Form>
</div>
