<script>
    import {Asset} from 'anchor-link'

    import InputAsset from '~/components/elements/input/asset.svelte'
    import InputLabel from '~/components/elements/input/label.svelte'
    import Button from '~/components/elements/button.svelte'

    import {currentLiquidBalance} from '~/stores/account'

    import {earnData, Step} from '~/pages/earn/earn'

    let amount: string = String(($earnData.quantity && $earnData.quantity.value) || '')
    let amountValid: boolean = false

    function fillMax() {
        amount = String($currentLiquidBalance!.value)
        amountValid = true
    }

    function confirmChange() {
        earnData.update((data) => ({
            ...data,
            quantity: Asset.from(Number(amount), $currentLiquidBalance!.symbol),
            step: Step.Confirm,
        }))
    }
</script>

<style type="scss">
    @import './style.scss';
    .balance,
    .votereq {
        margin: 1em;
        span {
            cursor: pointer;
            text-decoration: underline;
        }
    }
</style>

{#if $currentLiquidBalance}
    <div class="title">
        <h1>How to Earn</h1>
        <h3>Earn an estimated 1% APR by staking your tokens.</h3>
    </div>
    <div class="initial">
        <InputLabel>Select amount to stake</InputLabel>
        <InputAsset
            bind:valid={amountValid}
            bind:value={amount}
            focus
            fluid
            name="amount"
            placeholder={`Enter amount of tokens`}
            balance={$currentLiquidBalance}
        />
        <div class="balance">
            Available balance:
            <span on:click={fillMax}>
                {String($currentLiquidBalance)}
            </span>
        </div>
        <input type="checkbox" label="Auto vote" />
        <Button
            fluid
            style="primary"
            size="large"
            disabled={!amountValid}
            formValidation
            on:action={confirmChange}
        >
            Deposit
        </Button>
        <div class="votereq">Vote for 21 validators to enable staking</div>
    </div>
{/if}
<div class="returns">
    <div class="est30">
        <div class="label">30 day estimate</div>
        <div class="value">+10 TOKEN</div>
    </div>
    <div class="est90">
        <div class="label">30 day estimate</div>
        <div class="value">+10 TOKEN</div>
    </div>
    <div class="est365">
        <div class="label">30 day estimate</div>
        <div class="value">+10 TOKEN</div>
    </div>
</div>
