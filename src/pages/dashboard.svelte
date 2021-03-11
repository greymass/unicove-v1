<script lang="ts">
    import {activeBlockchain, activeSession, currentAccount} from '~/store'
    import Button from '~/components/elements/button.svelte'
    import Page from '~/components/layout/page.svelte'
    import {priceTicker} from '~/price-ticker'
    import {Asset} from '@greymass/eosio'

    $: price = priceTicker($activeBlockchain).catch((error) => {
        console.warn(`Unable to load price on ${$activeBlockchain.id}`, error)
    })

    async function testmessage() {
        await $activeSession!.transact({
            action: {
                authorization: [$activeSession!.auth],
                account: 'hello.gm',
                name: 'setmessage',
                data: {
                    account: $activeSession!.auth.actor,
                    message: 'Hello world',
                },
            },
        })
    }
</script>

<Page title="Dashboard">
    <p>
        Hello <b>{$currentAccount?.account_name}</b> looks like you are using
        <b>{$currentAccount?.ram_usage}</b> of RAM.
    </p>
    {#if $price}
        <p>
            {Asset.fromFloat(1, $activeBlockchain.coreTokenSymbol)} = {$price} USD
        </p>
    {/if}
    <Button on:action={testmessage}>Message</Button>
</Page>
