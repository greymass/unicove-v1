<script lang="ts">
    import {Asset} from 'anchor-link'

    import Button from '~/components/elements/button.svelte'

    import type {REXInfo} from '~/pages/earn/types'

    export let availableTokens: Asset
    export let rexEOSBalance: Asset
    export let rexInfo: REXInfo
    export let toStake: () => void
    export let toUnstake: () => void
    export let toClaim: () => void
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
        margin-bottom: 21px;
    }
    .bottom-section {
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: center;
        text-align: center;
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
        color: var(--dark-grey);
        font-weight: 600;
        font-size: 10px;
        line-height: 12px;
        letter-spacing: 0.1px;
        text-transform: uppercase;
        margin-bottom: 12px;
        text-align: center;
    }
    .staked {
        color: var(--black);
        font-family: Inter;
        font-style: normal;
        font-weight: bold;
        font-size: 24px;
        line-height: 29px;
        text-align: center;
        letter-spacing: -0.47px;
        margin-bottom: 2px;
    }
    .unstakable {
        color: var(--dark-grey);
        font-family: Inter;
        font-style: normal;
        font-weight: bold;
        font-size: 12px;
        line-height: 29px;
        text-align: center;
        letter-spacing: -0.47px;
        margin-bottom: 2px;
    }
    .claimable {
        color: var(--dark-grey);
        font-family: Inter;
        font-style: normal;
        font-weight: bold;
        font-size: 12px;
        line-height: 29px;
        text-align: center;
        letter-spacing: -0.47px;
        margin-bottom: 26px;
    }

    .faq {
        color: var(--main-blue);
        font-family: Inter;
        font-style: normal;
        font-weight: bold;
        font-size: 12px;
        line-height: 29px;
        text-align: center;
        letter-spacing: -0.47px;
        margin-bottom: 26px;
        text-decoration: none;
    }
</style>

<div class="container">
    <div class="top-section">
        <div class="header">EOS Staking</div>
        <div class="subheader">Earn ~{rexInfo.apy}% APY*</div>
    </div>
    <div class="middle-section">
        <div class="rex">
            <div class="label">currently staked balance</div>
            <div class="staked">
                {rexInfo.total}
            </div>
            {#if Number(rexInfo.savings.value) > 0}
                <div class="unstakable">
                    Unstakable: {rexInfo.savings}
                </div>
            {/if}
            {#if Number(rexInfo.matured.value) > 0 || Number(rexEOSBalance.value) > 0}
                <div class="claimable">
                    Withdrawable: {Asset.fromUnits(
                        rexInfo.matured.units.adding(rexEOSBalance.units),
                        rexEOSBalance.symbol
                    )}
                </div>
            {/if}

            <div class="buttons">
                <Button
                    fluid
                    style="primary"
                    size="regular"
                    disabled={availableTokens.value <= 0}
                    formValidation
                    on:action={toStake}
                >
                    Stake
                </Button>
                <Button
                    fluid
                    style="primary"
                    size="regular"
                    disabled={rexInfo.savings.value <= 0}
                    formValidation
                    on:action={toUnstake}
                >
                    Unstake
                </Button>
                <Button
                    fluid
                    style="primary"
                    size="regular"
                    disabled={rexInfo.matured.value <= 0 && rexEOSBalance.value <= 0}
                    formValidation
                    on:action={toClaim}
                >
                    Withdraw
                </Button>
            </div>
        </div>
    </div>
    <div class="bottom-section">
        <p>The unstaking process takes 21 days before the tokens become available to withdraw.</p>
        <br />
        <p>* The APY changes based on the total number of EOS tokens staked at any given moment.</p>
    </div>
</div>
