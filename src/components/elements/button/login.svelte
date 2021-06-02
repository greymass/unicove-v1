<script lang="ts">
    import {login} from '~/auth'
    import Button from '~/components/elements/button.svelte'
    import Icon from '~/components/elements/icon.svelte'
    import Text from '~/components/elements/text.svelte'

    let disabled = false
    let error: Error | undefined

    function loginHandler() {
        disabled = true
        login()
            .then(() => {
                error = undefined
            })
            .catch((err) => {
                error = err
            })
            .finally(() => {
                disabled = false
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
        align-items: center;
        .error {
            margin: 20px;
            color: var(--error-red);
        }
    }
</style>

<div class="login">
    <Button {disabled} size="large" primary on:action={loginHandler}>
        <Icon name="log-in" />
        <Text><slot /></Text>
    </Button>
    {#if error}
        <p class="error">Unable to login: {error.message}</p>
    {/if}
</div>
