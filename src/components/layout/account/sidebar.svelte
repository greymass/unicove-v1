<script>
    import {activate} from '~/auth'
    import type {SessionLike} from '~/auth'

    import Icon from '~/components/elements/icon.svelte'

    import List from './list.svelte'

    export let open = false

    function onSelect(session: SessionLike) {
        activate(session)
        open = false
    }
</script>

<style type="scss">
    aside {
        display: none;
        position: fixed;
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
        &.open {
            display: block;
            right: 0;
        }
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
</style>

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
