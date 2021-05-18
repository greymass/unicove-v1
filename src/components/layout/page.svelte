<script lang="ts">
    import {activeSession} from '~/store'

    import AccountSidebar from '~/components/layout/account/sidebar.svelte'
    import Header from '~/components/layout/header.svelte'
    import Navigation from '~/components/layout/navigation/index.svelte'

    /** Title of the page. */
    export let title: string = ''
    export let subtitle: string = ''

    /** Whether or not to show the left navigation */
    export let displayNavigation = true

    let accountSidebar = false
    let navigationSidebar = false
</script>

<style type="scss">
    $menubar_height: 71px;

    .dimmer {
        display: none;
        position: absolute;
        height: 100vh;
        width: 100vw;
        left: 0;
        top: 0;
        z-index: 1000 !important;
        background-color: rgba(0, 0, 0, 0.5);
        &.active {
            display: block;
        }
    }

    .grid {
        display: grid;
        grid-template-columns: 268px auto;
        grid-template-rows: $menubar_height minmax(0, auto);
        grid-template-areas:
            'leftbar header'
            'leftbar main';
        &.withoutsidebar {
            grid-template-rows: $menubar_height auto;
            grid-template-columns: 100vw;
            grid-template-areas:
                'header'
                'main';
        }
    }

    .page-header {
        grid-area: header;
    }

    .page-leftbar {
        min-height: 100vh;
        grid-area: leftbar;
    }

    .page-main {
        min-height: calc(100vh - #{$menubar_height});
        grid-area: main;
        .header,
        .content {
            padding: 0 30px;
        }
    }

    @media only screen and (max-width: 999px) {
        .grid {
            grid-template-rows: $menubar_height auto;
            grid-template-columns: 100vw;
            grid-template-areas:
                'header'
                'main';
        }
        .page-header {
            margin-left: 2em;
        }
        .page-leftbar {
            min-height: auto;
        }
        .page-main {
            .content {
                padding: 0 10px;
            }
        }
    }
</style>

<div
    class="dimmer"
    class:active={accountSidebar || navigationSidebar}
    on:click={() => {
        accountSidebar = false
        navigationSidebar = false
    }}
/>
<div class="grid" class:withoutsidebar={!displayNavigation || !$activeSession}>
    {#if displayNavigation && $activeSession}
        <aside class="page-leftbar">
            <Navigation bind:open={navigationSidebar} />
        </aside>
    {/if}
    <header class="page-header">
        {#if $$slots.submenu}
            <div class="submenu">
                <slot name="submenu" />
            </div>
        {/if}
        <AccountSidebar bind:open={accountSidebar} />
    </header>
    <main class="page-main">
        <div class="header">
            {#if title}
                <div class="title">
                    <Header {title} {subtitle} />
                </div>
            {/if}
            {#if $$slots.controls}
                <div class="controls">
                    <slot name="controls" />
                </div>
            {/if}
        </div>
        <div class="content">
            <slot />
        </div>
    </main>
</div>
