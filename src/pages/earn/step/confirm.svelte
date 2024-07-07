<script lang="ts">
    import {getContext} from 'svelte'
    import type {Asset} from 'anchor-link'
    import type {Token} from '~/stores/tokens'
    import type {FormTransaction} from '~/ui-types'

    import Button from '~/components/elements/button.svelte'
    import TokenImage from '~/components/elements/image/token.svelte'
    import ProgressBar from '~/pages/earn/components/progress.svelte'
    import LabelValue from '~/pages/earn/components/label.svelte'

    export let action: string
    export let amount: Asset
    export let token: Token | undefined
    let usd: string | null = token
        ? token.price
            ? (Number(amount.value) * token.price).toFixed(2)
            : null
        : null

    export let tokenKey: string
    export let handleConfirm: (context: FormTransaction) => void
    export let handleBack: () => void

    const context: FormTransaction = getContext('transaction')
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
        margin-bottom: 62px;
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
    .amount {
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }

    .logo-container {
        display: flex;
        margin-right: 10px;
    }

    .value {
        padding-top: 8px;
        font-weight: 550;
        font-size: 10px;
        line-height: 12px;
        letter-spacing: 0.1px;
        text-transform: uppercase;
        color: var(--light-grey);
    }
</style>

<div class="container">
    <div class="top-section">
        <div class="header">{action}</div>
        <div class="subheader">Review and sign</div>
        <ProgressBar step={2} />
    </div>
    <div class="middle-section">
        <LabelValue header="Action">
            <span>{action}</span>
        </LabelValue>
        <LabelValue header="Token Amount" changeStep={handleBack}>
            <div class="amount">
                <span class="logo-container">
                    <TokenImage width="18" height="18" {tokenKey} />
                </span>
                <span>{amount}</span>
            </div>
            {#if usd}
                <div class="value">≈ $ {usd} USD</div>
            {/if}
        </LabelValue>
    </div>
    <div class="bottom-section">
        <Button
            fluid
            style="primary"
            size="large"
            disabled={false}
            formValidation
            on:action={() => {
                handleConfirm(context)
            }}
        >
            Sign transaction
        </Button>
    </div>
</div>
