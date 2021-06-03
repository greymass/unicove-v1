<script>
    import {activeSession, preferences, darkMode} from '~/store'
    import Icon from '~/components/elements/icon.svelte'

    export let open = false

    function setDarkMode(state: boolean, event: MouseEvent) {
        preferences.darkmode = event.shiftKey ? null : state
    }
</script>

<style type="scss">
    .account-button {
        color: var(--main-black);
        cursor: pointer;
        font-size: 14px;
        padding: 30px 16px;
        margin: 0 6px 0 auto;
        .icon {
            color: var(--main-blue);
            line-height: 16px;
            margin-right: 10px;
            vertical-align: middle;
        }
    }
    @media only screen and (max-width: 600px) {
        .account-button .accounts {
            .icon {
                margin-right: 0;
            }
            .text {
                display: none;
            }
        }
    }
</style>

<div class="account-button">
    {#if $darkMode}
        <span class="icon" on:click={(event) => setDarkMode(false, event)}>
            <Icon name="sun" />
        </span>
    {:else}
        <span class="icon" on:click={(event) => setDarkMode(true, event)}>
            <Icon name="moon" />
        </span>
    {/if}
    <span class="accounts" on:click={() => (open = true)}>
        <span class="icon">
            <Icon name="user" />
        </span>
        <span class="text">
            {#if $activeSession}
                {$activeSession?.auth.actor}
            {:else}
                Login
            {/if}
        </span>
    </span>
</div>
