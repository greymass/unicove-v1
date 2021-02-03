<script lang="ts">
    import {currentAccount} from '~/store'

    import {API} from '@greymass/eosio'

    import Button from '~/components/elements/button.svelte'
    import Page from '~/components/layout/page.svelte'

    import {activeSession} from '../store'

    console.log(API)

    async function testbuyram() {
        await $activeSession!.transact({
            action: {
                authorization: [$activeSession!.auth],
                account: 'eosio',
                name: 'buyrambytes',
                data: {
                    payer: $activeSession!.auth.actor,
                    receiver: $activeSession!.auth.actor,
                    bytes: 100,
                },
            },
        })
    }

    async function testsellram() {
        console.log('selling ram')
        console.log($currentAccount)
        const bytes = $currentAccount.ram_quota - $currentAccount.ram_usage
        await $activeSession!.transact({
            action: {
                authorization: [$activeSession!.auth],
                account: 'eosio',
                name: 'sellram',
                data: {
                    account: $activeSession!.auth.actor,
                    bytes,
                },
            },
        })
    }

    async function testauth() {
        console.log('auth!')

        await $activeSession!.transact({
            action: {
                authorization: [$activeSession!.auth],
                account: 'eosio',
                name: 'updateauth',
                data: {
                    account: $activeSession!.auth.actor,
                    permission: 'test',
                    parent: 'active',
                    auth: {
                        threshold: 1,
                        keys: [
                            {
                                key: 'PUB_K1_6jM8XtVi1rs64zsczMYEHWkD5gDGoVbUiyq5cXnr4KVgDVjxYL',
                                weight: 1,
                            },
                        ],
                        accounts: [],
                        waits: [],
                    },
                },
            },
        })
    }

    async function testremoveauth() {
        console.log('remove auth!')
        await $activeSession!.transact({
            action: {
                authorization: [$activeSession!.auth],
                account: 'eosio',
                name: 'deleteauth',
                data: {
                    account: $activeSession!.auth.actor,
                    permission: 'test',
                },
            },
        })
    }
</script>

<Page title="Dashboard">
    <p>
        Hello <b>{$currentAccount?.account_name}</b> looks like you are using
        <b>
            {$currentAccount?.ram_usage} / {$currentAccount?.ram_quota}
            ({(($currentAccount?.ram_usage / $currentAccount?.ram_quota) * 100).toPrecision(5)}%)
        </b>
        of RAM.
    </p>
    <hr />
    <p>Add a test auth to account in order to consume ram:</p>
    <Button on:action={testauth}>Add Auth</Button>
    <hr />
    <p>Remove the test auth to free that ram up:</p>
    <Button on:action={testremoveauth}>Remove Auth</Button>
    <hr />
    <p>Sell all available RAM:</p>
    <Button on:action={testsellram}
        >Sell {$currentAccount?.ram_quota - $currentAccount?.ram_usage} Bytes</Button
    >
    <hr />
    <p>Buy some extra RAM if available is too low:</p>
    <Button on:action={testbuyram}>Buy 100 Bytes</Button>
</Page>
