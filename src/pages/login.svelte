<script lang="ts">
    import {login} from '../auth'

    let working = false
    let error: Error | undefined

    function loginHandler() {
        working = true
        login()
            .then(() => {
                error = undefined
            })
            .catch((err) => {
                error = err
            })
            .finally(() => {
                working = false
            })
    }
</script>

{#if !working}
    <p>Welcome to Greymass Wallet</p>
    <p>Please login to continue</p>
    <button on:click={loginHandler}>Login with Anchor</button>
    {#if error}
        <p>That didn't go well... {error.message}</p>
    {/if}
{:else}
    <p>Working really hard here...</p>
{/if}
