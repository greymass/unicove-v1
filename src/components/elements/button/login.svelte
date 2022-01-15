<script lang="ts">
    import {login} from '~/auth'
    import Button from '~/components/elements/button.svelte'
    import Icon from '~/components/elements/icon.svelte'
    import Text from '~/components/elements/text.svelte'

    let disabled = false
    let error: Error | undefined
    export let asLink = false
    export let style: 'default' | 'primary' | 'secondary' | 'no-frame' | 'effect' = 'secondary'

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

{#if asLink}
    <a href={undefined} on:click={loginHandler} alt="login link"><slot /></a>
{:else}
    <div class="login">
        <Button {disabled} size="regular" {style} on:action={loginHandler}>
            <Icon name="log-in" />
            <Text><slot /></Text>
        </Button>
        {#if error}
            <p class="error">Unable to login: {error.message}</p>
        {/if}
    </div>
{/if}
