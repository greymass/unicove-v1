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

    export let amount: string
    export let token: Token | undefined
    export let availableTokens: Asset
    export let nextStep: () => void

    let tokenOptions: Token[] = []
    if (token) {
        let newToken = {...token}
        newToken.balance = availableTokens
        tokenOptions = [newToken]
    }
    let amountValid = false

    function onConfirm() {
        nextStep()
    }

    function onAmountChanged(event: CustomEvent<InputResponse>) {
        let newAmount = Asset.from(Number(event.detail.value), availableTokens.symbol).value
        amount = String(newAmount)
    }
</script>

<style type="scss">
    .container {
        border: 1px solid var(--divider-grey);
        border-radius: 20px;
        padding: 26px;
        :global(.button) {
            margin-top: 31px;
        }
    }
    .top-section {
        margin-bottom: 42px;
    }
    .middle-section {
        margin: 0 auto;
        max-width: 28rem;
        margin-bottom: 84px;
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
        margin-bottom: 32px;
    }
</style>

<div class="container">
    <div class="top-section">
        <div class="header">Unstake</div>
        <div class="subheader">Remove from your staked balance</div>
        <ProgressBar step={1} />
    </div>
    <div class="middle-section">
        <Form>
            <InputLabel>amount to unstake</InputLabel>
            <div class="token-selector">
                <TokenSelector
                    defaultToken={token}
                    {tokenOptions}
                    selectedToken={token}
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
                placeholder={amount}
                balance={availableTokens}
                on:changed={onAmountChanged}
            />
        </Form>
    </div>
    <div class="bottom-section">
        <Button
            fluid
            style="primary"
            size="large"
            disabled={false}
            formValidation
            on:action={onConfirm}
        >
            Unstake tokens
        </Button>
    </div>
</div>
