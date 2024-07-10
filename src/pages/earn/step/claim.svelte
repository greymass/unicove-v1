<script lang="ts">
    import {Asset} from 'anchor-link'

    import type {Token} from '~/stores/tokens'
    import type {InputResponse} from '~/ui-types'
    import Form from '~/components/elements/form.svelte'

    import ProgressBar from '~/pages/earn/components/progress.svelte'
    import Button from '~/components/elements/button.svelte'
    import InputAsset from '~/components/elements/input/asset.svelte'
    import InputLabel from '~/components/elements/input/label.svelte'
    import TokenSelector from '~/components/elements/input/token/selector.svelte'

    import type {REXInfo} from '~/pages/earn/types'

    export let amount: string
    export let token: Token | undefined
    export let rexInfo: REXInfo
    export let availableTokens: Asset
    export let nextStep: () => void
    export let handleBack: () => void

    let selectedToken: Token

    let tokenOptions: Token[] = []
    if (token) {
        let newToken = {...token, balance: availableTokens}
        selectedToken = newToken
        tokenOptions = [newToken]
    }
    let amountValid = false

    function maxBalance() {
        if (availableTokens) {
            amount = String(availableTokens.value)
            amountValid = true
        }
    }

    function onConfirm() {
        nextStep()
    }

    function onAmountChanged(event: CustomEvent<InputResponse>) {
        try {
            let newAmount = Asset.from(Number(event.detail.value), availableTokens.symbol).value
            amount = String(newAmount)
        } catch (error) {
            console.log('failed to apply amount change', error)
        }
    }
</script>

<style type="scss">
    .container {
        border: 1px solid var(--divider-grey);
        border-radius: 20px;
        padding: 26px;
    }
    .top-section {
        margin-bottom: 42px;
    }
    .middle-section {
        margin: 0 auto;
        max-width: 28rem;
        margin-bottom: 31px;
    }
    .bottom-section {
        margin: 0 auto;
        max-width: 28rem;
    }
    .header {
        color: var(--black);
        font-family: Inter;
        font-style: normal;
        font-weight: bold;
        font-size: 24px;
        line-height: 29px;
        text-align: center;
        letter-spacing: -0.47px;
        margin-bottom: 7px;
    }
    .subheader {
        color: var(--dark-grey);
        font-family: Inter;
        font-style: normal;
        font-weight: normal;
        font-size: 16px;
        line-height: 19px;
        text-align: center;
        letter-spacing: -0.18px;
    }
    .token-selector {
        margin-bottom: 10px;
    }
    .label {
        color: var(--dark-grey);
        font-weight: 600;
        font-size: 10px;
        line-height: 12px;
        letter-spacing: 0.1px;
        text-transform: uppercase;
        margin-bottom: 12px;
        text-align: start;
        margin-bottom: 32px;
    }
    .controls {
        margin-top: 31px;
        text-align: center;
        :global(.button) {
            background: none;
            color: var(--main-blue);
            font-size: 10px;
            text-transform: uppercase;
        }
    }
    .actions {
        padding: 13px;
        cursor: pointer;
        font-family: Inter;
        font-style: normal;
        font-weight: bold;
        font-size: 10px;
        line-height: 12px;
        display: flex;
        justify-content: end;
        align-items: center;
        text-align: center;
        letter-spacing: 0.1px;
        text-transform: uppercase;
        color: var(--main-blue);
        user-select: none;
        -webkit-user-select: none;
    }
</style>

<div class="container">
    <div class="top-section">
        <div class="header">Withdraw</div>
        <div class="subheader">Withdraw tokens from the staking contract</div>
        <ProgressBar step={1} />
    </div>
    <div class="middle-section">
        <Form on:submit={onConfirm}>
            <InputLabel>amount to withdraw</InputLabel>
            <div class="token-selector">
                <TokenSelector
                    defaultToken={selectedToken}
                    {tokenOptions}
                    {selectedToken}
                    onTokenSelect={() => {}}
                />
            </div>

            <InputAsset
                bind:valid={amountValid}
                bind:value={amount}
                symbol={availableTokens.symbol}
                focus
                fluid
                name="amount"
                placeholder={`Enter amount of tokens`}
                balance={availableTokens}
                on:changed={onAmountChanged}
            />
            <div class="actions">
                <span on:click={maxBalance}>Entire Balance</span>
            </div>
        </Form>
    </div>
    <div class="bottom-section">
        <Button
            fluid
            style="primary"
            size="large"
            disabled={!amountValid}
            formValidation
            on:action={onConfirm}
        >
            Withdraw Tokens
        </Button>

        <div class="controls">
            <Button style="no-frame" on:action={handleBack}>Cancel</Button>
        </div>
    </div>
</div>
