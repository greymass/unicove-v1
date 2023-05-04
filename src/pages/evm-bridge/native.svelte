<script lang="ts">
    import { login, logout } from '~/auth'
    import {activeSession} from '~/store'
    import {Transfer} from '~/abi-types'

    async function transfer(quantity: number) {
        const action = Transfer.from({
                    from: $activeSession!.auth.actor,
                    to: "eosio.evm",
                    quantity,
                    memo: $ethAddress.toEOSAddress(),
                })
        const result = await $activeSession!.transact({
                action: {
                    authorization: [$activeSession!.auth],
                    account: 'eosio.token',
                    name: 'EOS',
                    data: action,
                },
            })
    }
</script>

<main>
    <button on:click={login}>Login</button>

    {#if $activeSession}
        {$activeSession.auth?.actor}
        <button on:click={logout}>Logout</button>
    {/if}
</main>

<style>
</style>
