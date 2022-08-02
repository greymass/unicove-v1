<script>
    import {derived} from 'svelte/store'

    import InputLabel from '~/components/elements/input/label.svelte'
    import Button from '~/components/elements/button.svelte'

    import {currentLiquidBalance, currentREXBalance, currentREXBalanceValue} from '~/stores/account'
    import {activePriceTicker} from '~/store'

    const hasLiquidTokens = derived(currentLiquidBalance, ($balance) => {
        return $balance!.value > 0
    })
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
        <Button size="large" disabled={!hasLiquidTokens}>Deposit</Button>
        <Button size="large">Withdraw</Button>
    </div>
{/if}
