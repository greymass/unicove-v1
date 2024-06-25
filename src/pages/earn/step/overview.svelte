<script lang="ts">
    import type {Asset} from 'anchor-link'

    import Button from '~/components/elements/button.svelte'

    export let maturedBalance: Asset
    export let rexBalance: Asset
    export let toStake: () => void
    export let toUnstake: () => void
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
    .rex {
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: center;
        width: 100%;
    }
    .buttons {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        gap: 12px;
    }
    .label {
        color: var(--main-black);
        font-weight: 600;
        font-size: 10px;
        line-height: 12px;
        letter-spacing: 0.1px;
        text-transform: uppercase;
        margin-bottom: 12px;
        text-align: center;
    }
    .balance {
        color: var(--black);
        font-family: Inter;
        font-style: normal;
        font-weight: bold;
        font-size: 24px;
        line-height: 29px;
        text-align: center;
        letter-spacing: -0.47px;
        margin-bottom: 26px;
    }
</style>

<div class="container">
    <div class="top-section">
        <div class="header">How to Earn</div>
        <div class="subheader">Earn by staking</div>
    </div>
    <div class="middle-section">
        <div class="rex">
            <div class="label">currently staked balance</div>
            <div class="balance">
                {maturedBalance.value} / {rexBalance.value}
                {rexBalance.symbol.name}
            </div>
            <div class="buttons">
                <Button
                    fluid
                    style="primary"
                    size="regular"
                    disabled={false}
                    formValidation
                    on:action={toStake}
                >
                    Stake
                </Button>
                <Button
                    fluid
                    style="primary"
                    size="regular"
                    disabled={false}
                    formValidation
                    on:action={toUnstake}
                >
                    Unstake
                </Button>
            </div>
        </div>
    </div>
    <div class="bottom-section" />
</div>
