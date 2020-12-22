<script lang="ts">
    import {login} from '../auth'
    import {_} from '../i18n'
    
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
    <p>{$_('login.welcome')}</p>
    <p>{$_('login.instruction')}</p>
    <button on:click={loginHandler}>{$_('login.button')}</button>
    {#if error}
        <p>{$_('login.error')} {error.message}</p>
    {/if}
{:else}
    <p>{$_('login.working')}</p>
{/if}
