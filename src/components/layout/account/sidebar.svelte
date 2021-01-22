<script>
    import {activeSession} from '~/store'
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
        height: 100%;
        max-width: 300px;
        position: absolute;
        right: -100%;
        transition: left 0.3s ease-in-out;
        width: 50%;
        top: 0;
        background-color: var(--main-grey);
        border-color: darkgray;
        border-right-width: 2px;
        display: none;
        z-index: 1001;
    }

    .header {
        margin: 24px 0 24px 24px;
        padding-bottom: 21px;
        border-bottom: 1px solid var(--divider-grey);
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

<div class="account-button" on:click={() => (open = true)}>
    <span class="icon">
        <Icon name="user" />
    </span>
    <span class="text">
        {$activeSession?.auth.actor}
    </span>
</div>

<aside class:open>
    <div class="header">
        <!-- svelte-ignore a11y-missing-attribute -->
        <a on:click={() => (open = false)}>
            <Icon name="x" />
        </a>
        Accounts
    </div>

    <List {onSelect} />
</aside>
