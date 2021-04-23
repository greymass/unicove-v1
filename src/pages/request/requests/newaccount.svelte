<script lang="ts">
    import {readable} from 'svelte/store'
    import type {Action} from '@greymass/eosio'
    import {Asset, Transaction} from '@greymass/eosio'

    import Button from '~/components/elements/button.svelte'
    import QRCode from '~/components/elements/qrcode.svelte'

    import {stateRAM} from '~/pages/request/resources'
    import {priceTicker} from '~/price-ticker'
    import {getClient} from '~/api-client'

    import Loading from './loading.svelte'

    export let transaction: any
    export let session: any
    export let chain: any
    export let request: any
    export let sign: any

    // Show a loading screen while the template determines if the account exists
    let loading: boolean = true

    // The eosio::newaccount action
    let newaccount: any

    // The eosio::buyram action
    let buyram: any

    // The cost to perform the transaction
    let cost: Asset = Asset.fromUnits(0, $chain.coreTokenSymbol)

    // The price of the system token for this chain
    $: price = priceTicker($chain).catch((error) => {
        console.warn(`Unable to load price on ${$chain.id}`, error)
    })

    // Subscribe to the transaction itself and update the two actions
    transaction.subscribe((tx: Transaction) => {
        newaccount = tx.actions.find(
            (action: Action) => action.account.equals('eosio') && action.name.equals('newaccount')
        )
        buyram = tx.actions.find(
            (action: Action) => action.account.equals('eosio') && action.name.equals('buyrambytes')
        )
    })

    // Method to query the chain for the account name existence
    export const getAccountExists = async (set: (v: any) => void) => {
        if (newaccount) {
            getClient($chain)
                .v1.chain.get_account(newaccount.data.name)
                .then((response) => {
                    if (response.account_name.equals(newaccount.data.name)) {
                        set(true)
                    }
                })
                .catch((error) => {
                    const isUnkownAccountError = error.toString().includes('exception: unknown key')
                    if (isUnkownAccountError) {
                        set(false)
                        return
                    }
                    throw error
                })
                .finally(() => (loading = false))
        }
    }

    // Live updating status of whether or not the account exists
    export const accountExists = readable<boolean | undefined>(undefined, (set) => {
        getAccountExists(set)
        const interval = setInterval(() => getAccountExists(set), 15000)
        return () => {
            clearInterval(interval)
        }
    })

    // Subscribe to the RAM state in order to determine creation cost
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

{#if loading}
    <Loading />
{:else if $accountExists === true}
    <div>This account was already created!</div>
{:else}
    <div>
        <QRCode data={String($request)} />

        <div class="info">
            <h2>Account Creation Request</h2>
            <p>Someone has requested the creation of a new account.</p>
        </div>

        <ul class="request">
            {#if newaccount}
                <li>
                    <span>EOSIO Network</span>
                    <span>{String($chain.name)}</span>
                </li>
            {/if}
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
            {#if $chain}
                {#if $session}
                    {#if $chain.chainId.equals($session.chainId)}
                        <Button primary size="large" on:action={sign}
                            >Pay to create this account</Button
                        >
                    {:else}
                        <h2>Switch to an account on {$chain.name} to sign.</h2>
                        <Button primary size="large" disabled>Pay to create this account</Button>
                    {/if}
                {:else}
                    <p>
                        To approve this request, either scan the QR code above with a compatible
                        wallet or use the button below to manually sign this request with Anchor.
                    </p>
                    <Button primary size="large" on:action={sign}>Pay to create this account</Button
                    >
                {/if}
            {/if}
            {#if cost && $chain}
                <div>
                    <p>Estimated account creation cost of {cost}</p>
                    {#if $price}
                        <p>
                            Valued at ${Asset.from(cost.value * Number($price), '2,USD')} (${Asset.from(
                                Number($price),
                                '2,USD'
                            ).value}
                            {$chain.coreTokenSymbol.name}/USD)
                        </p>
                    {/if}
                </div>
            {/if}
        </div>
    </div>
{/if}
