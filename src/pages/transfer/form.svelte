<script lang="ts">
    import {Asset as CoreAsset} from '@greymass/eosio'
    import {activeEvmSession, activeSession, activeBlockchain} from '~/store'
    import {tokens, type Token, makeTokenKey, tokenFromBalance} from '~/stores/tokens'

    import Label from '~/components/elements/input/label.svelte'
    import Form from '~/components/elements/form.svelte'
    import Button from '~/components/elements/button.svelte'
    import Asset from '~/components/elements/input/asset.svelte'
    import Selector from '~/components/elements/input/token/selector.svelte'
    import type {TransferManager} from './managers/transferManager'
    import {transferManagers} from './managers'
    import type {EvmSession} from '~/lib/evm'
    import {balances} from '~/stores/balances'

    export let handleContinue: () => void
    export let amount: string = ''
    export let from: Token | undefined
    export let to: Token | undefined
    export let transferManager: TransferManager | undefined
    export let feeAmount: CoreAsset | undefined
    export let sentAmount: CoreAsset | undefined
    export let receivedAmount: CoreAsset | undefined
    export let useEntireBalance: () => void

    let validAmount = false

    function handleFromChange(token: Token) {
        resetForm() // reset form when changing from token
        from = token
    }

    function handleToChange(token: Token) {
        to = token
    }

    $: readyToContinue = from && to && validAmount

    function onContinue() {
        if (readyToContinue) {
            removeEventListener('keyup', handleEnter)

            handleContinue()
        }
    }

    function resetForm() {
        from = undefined
        to = undefined
        amount = ''
        feeAmount = undefined
    }

    $: {
        if ($activeSession?.identifier) {
            resetForm()
        }
    }

    let fromOptions: Token[] = []
    let toOptions: Token[] = []
    let availableToReceive: CoreAsset | undefined

    let generatingOptions = false

    $: balance = $balances.find((balance) => balance.tokenKey === from?.key)

    async function generateOptions(evmSession?: EvmSession) {
        if (!!generatingOptions) return

        generatingOptions = true

        fromOptions = []

        await Promise.all(
            Object.values(transferManagers).map(async (transferManagerData) => {
                const TransferManagerClass = transferManagerData.transferClass

                // Only displaying accounts that support the current chain
                if (!TransferManagerClass.supportedChains.includes($activeBlockchain?.id)) return

                const tokenKey = makeTokenKey({
                    chainId: $activeBlockchain!.chainId,
                    contract: transferManagerData.tokenContract,
                    name: transferManagerData.tokenName,
                })

                let token = $tokens?.find((token) => token.key === tokenKey)

                if (!token) {
                    const balance = $balances.find((balance) => balance.tokenKey === tokenKey)

                    token = balance && tokenFromBalance(balance)
                }

                if (!token) {
                    console.error(`Token ${transferManagerData.tokenName} not found`)
                    return
                }

                fromOptions.push(token)
            })
        )

        generatingOptions = false
    }

    $: {
        if (from) {
            toOptions = fromOptions.filter(
                (token) => from?.symbol.equals(token.symbol) && token.name !== from?.name
            )
        } else {
            toOptions = fromOptions
        }
    }

    $: {
        if ($tokens) {
            generateOptions()
        }
    }

    $: {
        const balanceAmount = balance?.quantity
        const feeIsInSameToken = String(feeAmount?.symbol) === String(from?.symbol)
        const valueAvailableToReceive =
            (balanceAmount?.value || 0) - (feeIsInSameToken ? feeAmount?.value || 0 : 0)
        availableToReceive =
            balanceAmount &&
            CoreAsset.from(valueAvailableToReceive, balanceAmount?.symbol || '4,EOS')
    }

    // Continue when the user presses enter
    const handleEnter = (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
            event.preventDefault()

            onContinue()
        }
    }

    addEventListener('keyup', handleEnter)
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
                min-height: 220px;

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

                .label-container {
                    padding: 3px 8px;
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
                    balance={availableToReceive}
                    bind:valid={validAmount}
                    bind:value={amount}
                />
                {#if from && to}
                    <button type="button" on:click={useEntireBalance} on:keyup={() => {}}>
                        Entire Balance
                    </button>
                {/if}
            </div>
            <div class="right-section">
                <Label align="left">To</Label>
                <div class="selector-container">
                    <Selector
                        onTokenSelect={handleToChange}
                        selectedToken={to}
                        tokenOptions={toOptions}
                        showTokensWithoutBalance
                    />
                </div>
                {#if sentAmount && sentAmount.value > 0 && feeAmount && feeAmount.value > 0}
                    {#if feeAmount.symbol.equals(sentAmount.symbol)}
                        <div class="label-container">
                            <Label align="left">Amount Received: {String(receivedAmount)}</Label>
                        </div>
                        <div class="label-container">
                            <Label align="left">Transfer Fee: {String(feeAmount)}</Label>
                        </div>
                        <div class="label-container">
                            <Label align="left">Total Transferred: {String(sentAmount)}</Label>
                        </div>
                    {:else}
                        <div class="label-container">
                            <Label align="left">Amount Sent: {String(sentAmount)}</Label>
                        </div>
                        <div class="label-container">
                            <Label align="left">Transfer Fee: {String(feeAmount)}</Label>
                        </div>
                    {/if}
                {/if}
            </div>
        </div>
        <div class="bottom-section">
            <Button fluid style="primary" disabled={!readyToContinue} on:action={onContinue}
                >Continue</Button
            >
            {#if !$activeEvmSession}
                <h3>Connect to metamask wallet to continue</h3>
            {/if}
        </div>
    </Form>
</div>
