<script lang="ts">
    import {login} from '~/auth'
    import Button from '~/components/elements/button.svelte'

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

<style lang="scss">
    .login {
        display: flex;
        flex-direction: column;
        justify-items: center;
        align-content: center;
        justify-content: center;
        height: 100vh;
        align-items: center;
        header {
            text-align: center;
        }
        .error {
            color: red;
        }
    }
</style>

<div class="login">
    {#if !working}
        <header>
            <h1>Welcome to Greymass Wallet</h1>
            <p>Please login to continue</p>
        </header>
        <Button size="large" primary on:action={loginHandler}>Login with Anchor</Button>
        {#if error}
            <p class="error">That didn't go well... {error.message}</p>
        {/if}
    {:else}
        <p>Working really hard here...</p>
    {/if}
</div>
