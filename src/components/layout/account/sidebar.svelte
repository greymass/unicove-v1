<script>
    import {activeSession, preferences} from '~/store'
    import {activate} from '~/auth'

    import type {SessionLike} from '~/auth'
    import List from './list.svelte'
    import Icon from '~/components/elements/icon.svelte'

    export let open = false

    function onSelect(session: SessionLike) {
        activate(session)
        open = false
    }
</script>

<style type="scss">
    .account-button {
        color: var(--main-black);
        cursor: pointer;
        font-size: 14px;
        position: absolute;
        right: 0;
        top: 0;
        padding: 30px;
        .icon {
            color: var(--main-blue);
            line-height: 14px;
            margin-right: 10px;
        }
    }

    aside {
        display: none;
        position: absolute;
        top: 0;
        right: -100%;
        height: 100%;
        max-height: 100vh;
        width: 268px;
        max-width: 300px;
        overflow-x: hidden;
        overflow-y: scroll;
        background-color: var(--main-grey);
        border-color: var(--main-grey);
        border-right-width: 2px;
        transition: left 0.3s ease-in-out;
        z-index: 1001;
    }

    .header {
        border-bottom: 1px solid var(--dark-grey);
        color: var(--dark-grey);
        margin: 24px;
        padding-bottom: 21px;
        .icon {
            color: var(--main-blue);
        }
    }

    .header a {
        cursor: pointer;
        margin-right: 5px;
        margin-bottom: -10px;
    }
    .open {
        display: block;
        right: 0;
    }
</style>

<div class="account-button">
    {#if preferences.darkmode}
        <span class="icon" on:click={() => (preferences.darkmode = false)}>
            <Icon name="sun" />
        </span>
    {:else}
        <span class="icon" on:click={() => (preferences.darkmode = true)}>
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

<aside class:open>
    <div class="header">
        <!-- svelte-ignore a11y-missing-attribute -->
        <a class="icon" on:click={() => (open = false)}>
            <Icon name="x" />
        </a>
        Accounts
    </div>

    <List {onSelect} />
</aside>
