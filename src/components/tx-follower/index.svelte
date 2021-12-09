<script lang="ts">
    import type {ChainConfig} from '~/config'
    import type {Checksum256Type} from '@greymass/eosio'

    import {Checksum256} from '@greymass/eosio'
    import {router} from 'tinro'

    import Icon from '~/components/elements/icon.svelte'
    import Button from '~/components/elements/button.svelte'
    import Card from '~/components/elements/card.svelte'

    import {exporerUrl, followTransaction} from './utils'
    import Summary from './summary.svelte'
    import Advanced from './advanced.svelte'

    /** The transaction id to follow. */
    export let id: Checksum256Type
    /** The chain where the transaction was submitted. */
    export let chain: ChainConfig
    /** Title, e.g. Tokens sent. */
    export let title = 'Transaction sent'

    let txId: Checksum256
    $: {
        try {
            txId = Checksum256.from(id)
        } catch (error) {
            console.warn('Invalid transaction id passed to TxFollower', error)
            txId = Checksum256.from(
                '0000000000000000000000000000000000000000000000000000000000000000'
            )
        }
    }
    $: status = followTransaction(txId, chain).value

    let tabs = [
        {id: 'summary', title: 'Summary', component: Summary},
        {id: 'advanced', title: 'Advanced', component: Advanced},
    ]
    let activeTab = tabs[0]
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
        <a target="_blank" href={exporerUrl(txId, chain)}>{txId}</a>
        <nav>
            <ul>
                {#each tabs as tab}
                    <li>
                        <a
                            href={`#tab-${tab.id}`}
                            class:active={tab === activeTab}
                            on:click|preventDefault|stopPropagation={() => (activeTab = tab)}
                        >
                            {tab.title}
                        </a>
                    </li>
                {/each}
            </ul>
        </nav>
    </header>
    {#if $status}
        <svelte:component this={activeTab.component} status={$status} />
    {/if}
    <footer>
        <div>
            <slot name="done">
                <Button style="primary" fluid size="large" on:action={() => router.goto('/')}>Done</Button>
            </slot>
        </div>
        <div>
            <Button fluid size="large" href={exporerUrl(txId, chain)} target="_blank">
                View on block explorer
            </Button>
        </div>
    </footer>
</Card>
