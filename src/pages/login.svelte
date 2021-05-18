<script lang="ts">
    import ButtonLogin from '~/components/elements/button/login.svelte'
    import Page from '~/components/layout/page.svelte'
</script>

<style lang="scss">
    .login {
        display: flex;
        flex-direction: column;
        justify-items: center;
        align-content: center;
        align-items: center;
        p {
            margin: 2em;
        }
        header {
            text-align: center;
        }
    }
</style>

<Page>
    <div class="login">
        <header>
            <h1>Welcome to Greymass Wallet</h1>
            <p>Please login to continue</p>
        </header>
        <ButtonLogin>Login with Anchor</ButtonLogin>
    </div>
</Page>
