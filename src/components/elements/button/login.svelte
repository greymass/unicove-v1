<script lang="ts">
    import {login} from '~/auth'
    import Button from '~/components/elements/button.svelte'
    import Icon from '~/components/elements/icon.svelte'
    import Text from '~/components/elements/text.svelte'
    import {addToast} from '~/stores/toast'

    let disabled = false
    export let asLink = false
    export let style: 'default' | 'primary' | 'secondary' | 'tertiary' | 'no-frame' | 'effect' = 'secondary'

    function loginHandler() {
        disabled = true
        login()
            .catch((err) => {
                addToast({title: 'Unable to login', message: err.message})
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
    </div>
{/if}
