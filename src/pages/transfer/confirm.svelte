<script lang="ts">
    import type {Asset} from '@greymass/eosio'

    import Button from '~/components/elements/button.svelte'
    import TokenImage from '~/components/elements/image/token.svelte'
    import {systemTokenKey} from '~/stores/tokens'

    import {valueInFiat} from '~/lib/fiat'

    import {evmAccount, activeSession, activePriceTicker} from '~/store'
    import type {Token} from '~/stores/tokens'

    export let from: Token
    export let to: Token
    export let depositAmount: Asset
    export let receivedAmount: Asset
    export let feeAmount: Asset | undefined
    export let handleConfirm: () => void
    export let handleBack: () => void
</script>

<style type="scss">
    .container {
        width: 100%;
        margin: auto;
        padding: 3em;
        background-color: transparent;
        text-align: center;
        border: 1px solid #ddd;
        border-radius: 30px;

        .top-section {
            margin-bottom: 2em;

            h1 {
                font-weight: bold;
                font-size: 1.8em;
            }

            h3 {
                margin-top: 10px;
                font-weight: normal;
                font-size: 1.5em;
            }
        }

        table {
            width: 100%;
            margin-bottom: 2em;

            tr {
                display: flex;
                justify-content: space-between;
                font-size: 11px;
                border-top: 1px solid #ddd;
                padding: 10px;
                min-height: 80px;

                &:first-child {
                    border: none;
                }

                td {
                    padding: 1.5em;
                    display: flex;
                    align-items: center;
                    flex-direction: column;
                    align-self: center;

                    &:first-of-type {
                        font-weight: bold;
                    }

                    .image-container {
                        display: inline-block;
                        vertical-align: middle;
                        margin-right: 3px;
                    }

                    .fiat-value {
                        font-size: 1em;
                        color: gray;
                        display: block;
                    }
                }
            }
        }

        .bottom-section {
            max-width: 300px;
            margin: auto;
        }

        /* Media Query for Mobile */
        @media screen and (max-width: 768px) {
            padding: 1em;
            border: none;

            table {
                tr {
                    flex-direction: column;
                    align-items: start;
                }
            }

            .bottom-section {
                max-width: 100%;
            }
        }
    }
</style>

<div class="container">
    <div class="top-section">
        <h1>Transfer</h1>
        <h3>Review and Sign</h3>
    </div>

    <table>
        <tr>
            <td>From {from.name === 'EOS (EVM)' ? 'EVM' : from.name}</td>
            <td>{from?.name === 'EVM' ? $evmAccount?.address : $activeSession?.auth.actor}</td>
        </tr>
        <tr>
            <td>To {to.name}</td>
            <td>{from?.name === 'EOS' ? $evmAccount?.address : $activeSession?.auth.actor}</td>
        </tr>
        <tr>
            <td>Deposit Amount</td>
            <td>
                <div>
                    <div class="image-container">
                        <TokenImage width="20" height="20" tokenKey={$systemTokenKey} />
                    </div>
                    {depositAmount}
                </div>
                <div class="fiat-value">
                    ~{valueInFiat(depositAmount?.value, $activePriceTicker)}
                </div>
            </td>
        </tr>
        <tr>
            <td>Fee Amount</td>
            <td>
                <div>
                    <div class="image-container">
                        <TokenImage width="20" height="20" tokenKey={$systemTokenKey} />
                    </div>
                    {feeAmount || '0.0000 EOS'}
                </div>
                <div class="fiat-value">
                    ~{valueInFiat(feeAmount?.value || 0, $activePriceTicker)}
                </div>
            </td>
        </tr>
        <tr>
            <td>Received Amount</td>
            <td>
                <div>
                    <div class="image-container">
                        <TokenImage width="20" height="20" tokenKey={$systemTokenKey} />
                    </div>
                    {receivedAmount}
                </div>
                <div class="fiat-value">
                    ~{valueInFiat(receivedAmount?.value, $activePriceTicker)}
                </div>
            </td>
        </tr>
    </table>
    <div class="bottom-section">
        <Button fluid style="primary" on:action={handleConfirm}>Sign Transaction</Button>
        <br />
        <Button fluid on:action={handleBack}>Cancel</Button>
    </div>
</div>
