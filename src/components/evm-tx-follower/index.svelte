<script lang="ts">
    import {Checksum256} from '@greymass/eosio'
    import {router} from 'tinro'

    import Icon from '~/components/elements/icon.svelte'
    import Button from '~/components/elements/button.svelte'
    import Card from '~/components/elements/card.svelte'

    import type { ethers } from 'ethers'

    /** Title, e.g. Tokens sent */
    export let title = 'Transaction sent'
    /** The EVM transaction result */
    export let evmTransactResult: ethers.providers.TransactionResponse | undefined
     /** The text of the primary button at the bottom of the page */
     export let primaryButtonText = 'Done'
    /** The function to call when the primary button is clicked */
    export let handlePrimaryButtonClick: () => void = () => {
        router.goto('/')
    }

    let txId: string
    if (evmTransactResult?.hash) {
        txId = evmTransactResult?.hash
    } else {
        console.warn('Invalid EVM Transact Result data passed to EvmTxFollower. Missing transaction hash.')
        txId = '0000000000000000000000000000000000000000000000000000000000000000'
    }

    const blockExplorerUrl = 'https://explorer.evm.eosnetwork.com/tx/'
    const blockExplorerTransactionUrl = `${blockExplorerUrl}${evmTransactResult?.hash}`
</script>

<style type="scss">
    header {
        text-align: center;
        h1 {
            font-size: 24px;
            letter-spacing: -0.47px;
            padding: 15px 0 24px;
        }
        :global(.icon) {
            color: var(--main-green);
        }
        a {
            text-decoration: none;
            text-overflow: ellipsis;
            overflow: hidden;
            display: block;
            color: var(--main-blue);
            &:visited {
                color: var(--main-blue);
            }
        }
        nav {
            margin-top: 30px;
            border-bottom: 1px solid var(--divider-grey);

            ul {
                display: flex;
                justify-content: center;

                a {
                    display: block;
                    border-bottom: 3px solid transparent;
                    padding: 10px 9px;
                    text-transform: uppercase;
                    font-size: 10px;
                    font-weight: bold;
                    margin: 0 21px;
                    &.active {
                        color: var(--main-black);
                        border-bottom-color: var(--main-blue);
                    }
                }
            }
        }
    }
    footer {
        margin-top: 48px;
        display: flex;
        div {
            width: 100%;
            &:first-child {
                margin-right: 10px;
            }
        }
        @media (max-width: 600px) {
            display: block;
            div:first-child {
                margin: 0 0 10px;
            }
        }
    }
</style>

<Card>
    <header>
        <Icon size="massive" name="check-circle" />
        <h1>{title}</h1>
        <a target="_blank" href={blockExplorerTransactionUrl}>{txId}</a>
    </header>
    <footer>
        <div>
            <slot name="done">
                <Button style="primary" fluid size="large" on:action={handlePrimaryButtonClick}
                    >{primaryButtonText}</Button
                >
            </slot>
        </div>
        <div>
            <Button fluid size="large" href={blockExplorerTransactionUrl} target="_blank">
                View on block explorer
            </Button>
        </div>
    </footer>
</Card>
