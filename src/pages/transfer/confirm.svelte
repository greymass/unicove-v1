<script lang="ts">
    import type {Asset} from '@greymass/eosio'

    import Button from '~/components/elements/button.svelte'
    import TokenImage from '~/components/elements/image/token.svelte'
    import {systemTokenKey} from '~/stores/tokens'

    import type {TransferManager} from './managers/transferManager'

    export let transferManager: TransferManager
    export let depositAmount: Asset
    export let receivedAmount: Asset
    export let feeAmount: Asset | undefined
    export let handleConfirm: () => void
    export let handleBack: () => void

    let depositAmountInUsd = ' N/A'
    let receivedAmountInUsd = ' N/A'
    let feeAmountInUsd = ' N/A'

    function getUsdValues() {
        transferManager.convertToUsd(depositAmount?.value).then((usdValue) => {
            depositAmountInUsd = usdValue
        })

        transferManager.convertToUsd(receivedAmount?.value).then((usdValue) => {
            receivedAmountInUsd = usdValue
        })

        if (feeAmount) {
            transferManager.convertToUsd(feeAmount?.value).then((usdValue) => {
                feeAmountInUsd = usdValue
            })
        }
    }

    getUsdValues()
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
            <td>From {transferManager.fromDisplayString}</td>
            <td>{transferManager.fromAddress}</td>
        </tr>
        <tr>
            <td>To {transferManager.toDisplayString}</td>
            <td>{transferManager.toAddress}</td>
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
                    ~{depositAmountInUsd}
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
                    {feeAmount || `0.0000 ${$systemTokenKey}`}
                </div>
                <div class="fiat-value">
                    ~{feeAmountInUsd}
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
                    ~{receivedAmountInUsd}
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
