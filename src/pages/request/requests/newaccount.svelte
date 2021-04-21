<script lang="ts">
    import type {Action} from '@greymass/eosio'
    import {Asset, Transaction} from '@greymass/eosio'

    import Button from '~/components/elements/button.svelte'
    import QRCode from '~/components/elements/qrcode.svelte'

    import {stateRAM} from '~/pages/resources/resources'
    import {priceTicker} from '~/price-ticker'

    export let transaction: any
    export let session: any
    export let chain: any
    export let request: any
    export let sign: any

    let newaccount: any
    let buyram: any
    let cost: Asset = Asset.fromUnits(0, $chain.coreTokenSymbol)

    $: price = priceTicker($chain).catch((error) => {
        console.warn(`Unable to load price on ${$chain.id}`, error)
    })

    transaction.subscribe((tx: Transaction) => {
        newaccount = tx.actions.find(
            (action: Action) => action.account.equals('eosio') && action.name.equals('newaccount')
        )
        buyram = tx.actions.find(
            (action: Action) => action.account.equals('eosio') && action.name.equals('buyrambytes')
        )
    })

    stateRAM.subscribe((state: any) => {
        if (state) {
            cost = Asset.from(state.price_per(buyram.data.bytes), $chain.coreTokenSymbol)
        }
    })
</script>

<style type="scss">
    .info {
        text-align: center;
        h2 {
            margin-top: 2em;
            font-family: Inter;
            font-style: normal;
            font-weight: bold;
            font-size: 24px;
            line-height: 29px;
            text-align: center;
            letter-spacing: -0.47px;

            color: #585d6e;
        }
        :global(.button) {
            margin: 2em 0 1em;
        }
    }
    ul.request {
        width: 400px;
        margin: 2em auto;
        font-size: 1.25em;
        li {
            padding: 1em 0;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            width: 100%;
            border-bottom: 1px solid black;

            font-family: Inter;
            font-style: normal;
            font-weight: bold;

            display: flex;
            align-items: center;
            letter-spacing: 0.01px;

            color: #585d6e;
            span {
                display: flex;
                flex-direction: column;
                flex-basis: 100%;
                flex: 1;
                text-align: right;
                &:first-child {
                    text-align: left;
                }
            }
            &:last-child {
                border: none;
            }
        }
    }
</style>

<div>
    <QRCode data={String($request)} />

    <div class="info">
        <h2>Account Creation Request</h2>
        <p>Someone has requested the creation of a new account.</p>
    </div>

    <ul class="request">
        {#if newaccount}
            <li>
                <span>Account Name</span>
                <span>{String(newaccount.data.name)}</span>
            </li>
        {/if}
        {#if buyram}
            <li>
                <span>Purchase RAM</span>
                <span>{String(buyram.data.bytes)} bytes</span>
            </li>
        {/if}
    </ul>

    <div class="info">
        {#if $chain && $session}
            {#if $chain.chainId.equals($session.chainId)}
                <Button primary size="large" on:action={sign}
                    >Create Account by paying {cost}</Button
                >
            {:else}
                <h2>Switch to an account on {$chain.name} to sign.</h2>
                <Button primary size="large" disabled>Sign Transaction</Button>
            {/if}
        {/if}
        {#if cost && $price && $chain}
            <div>
                Estimated total cost of ${Asset.from(cost.value * Number($price), '2,USD')}
            </div>
        {/if}
    </div>
</div>
