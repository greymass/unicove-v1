<script lang="ts">
    import {Asset} from 'anchor-link'
    import type {InputResponse} from 'src/ui-types'

    import Slider from '~/components/elements/slider.svelte'
    import Button from '~/components/elements/button.svelte'
    import Form from '~/components/elements/form.svelte'
    import InputAsset from '~/components/elements/input/asset.svelte'
    import InputLabel from '~/components/elements/input/label.svelte'

    export let amount: string
    export let availableTokens: Asset
    export let nextStep: () => void

    let percent = 0
    let amountValid = false

    function onAmountChanged(event: CustomEvent<InputResponse>) {
        try {
            let newAmount = Asset.from(Number(event.detail.value), availableTokens.symbol).value
            amount = String(newAmount)
            percent = Math.floor((newAmount / availableTokens.value) * 100)
        } catch (error) {
            console.log('failed to apply amount change', error)
        }
    }
    function onPercentChanged(event: any) {
        try {
            let newPercent = Number(event.detail.value)
            percent = newPercent
            let newAmount = Asset.from(
                (newPercent / 100) * availableTokens.value,
                availableTokens.symbol
            ).value
            amount = String(newAmount)
        } catch (error) {
            console.log('failed to apply percent change', error)
        }
    }
    function onConfirm() {
        nextStep()
    }
</script>

<style type="scss">
    .container {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        margin: 0 auto;
        max-width: 28rem;
    }
    .top-section {
        margin-bottom: 42px;
    }
    .middle-section {
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: center;
        border: 1px solid var(--divider-grey);
        border-radius: 8px;
        padding: 26px;
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
    .input {
        width: 100%;
    }
    .slider {
        margin-top: 20px;
        margin-bottom: 30px;
    }
</style>

<div class="container">
    <div class="top-section">
        <div class="header">How to Earn</div>
        <div class="subheader">Earn by staking</div>
    </div>
    <div class="middle-section">
        <div class="input">
            <Form>
                <InputLabel>selected amount to stake</InputLabel>
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
            </Form>
            <div class="slider">
                <Slider min={0} max={100} bind:value={percent} on:change={onPercentChanged} />
            </div>
            <Button
                fluid
                style="primary"
                size="large"
                disabled={!amountValid}
                formValidation
                on:action={onConfirm}
            >
                Deposit
            </Button>
        </div>
    </div>
    <div class="bottom-section" />
</div>
