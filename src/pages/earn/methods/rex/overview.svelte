<script>
    import {derived} from 'svelte/store'

    import InputLabel from '~/components/elements/input/label.svelte'
    import Button from '~/components/elements/button.svelte'

    import {currentLiquidBalance, currentREXBalance, currentREXBalanceValue} from '~/stores/account'
    import {activePriceTicker} from '~/store'
    import {earnData, Step} from '~/pages/earn/earn'

    const hasLiquidTokens = derived(currentLiquidBalance, ($balance) => {
        return $balance!.value > 0
    })

    function deposit() {
        earnData.update((data) => ({
            ...data,
            step: Step.Deposit,
            backStep: data.step,
        }))
    }

    function withdraw() {
        earnData.update((data) => ({
            ...data,
            step: Step.Withdraw,
            backStep: data.step,
        }))
    }
</script>

<style type="scss">
    @import './style.scss';
</style>

<div class="title">
    <h1>Earn</h1>
    <h3>Earn an estimated 1% APR by staking your tokens.</h3>
</div>
{#if $currentREXBalance && $currentREXBalance.value > 0}
    <div class="initial">
        <InputLabel>Current staked balance</InputLabel>
        <p class="balance">{$currentREXBalance}</p>
        <p>{$currentREXBalanceValue} @ {$activePriceTicker} EOS/USD</p>
        <Button size="large" on:action={deposit} disabled={!hasLiquidTokens}>Deposit</Button>
        <Button size="large" on:action={withdraw}>Withdraw</Button>
    </div>
{/if}
