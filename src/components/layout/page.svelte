<script lang="ts">
    import {activeSession} from '~/store'

    import AccountSidebar from '~/components/layout/account/sidebar.svelte'
    import AccountSidebarButton from '~/components/layout/account/button.svelte'
    import Header from '~/components/layout/header.svelte'
    import NavigationSidebar from '~/components/layout/navigation/index.svelte'
    import NavigationSidebarButton from '~/components/layout/navigation/button.svelte'
    import TokensPurchaseButton from '~/components/layout/tokens-purchase/button.svelte'

    /** Title of the page. */
    export let title: string = ''
    export let subtitle: string = ''

    /** Whether or not to show the left navigation */
    export let displayNavigation = true

    /** Whether or not to show the divider after the page title */
    export let divider = true

    let accountSidebar = false
    let navigationSidebar = false
</script>

<style type="scss">
    $grid_gap: 4em;
    $navigation_width: 268px;
    $menubar_height: 78px;
    $bottom_padding: 4em;

    .dimmer {
        display: none;
        position: fixed;
        height: 100vh;
        width: 100vw;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 1001 !important;
        background-color: rgba(0, 0, 0, 0.5);
        &.active {
            display: block;
        }
    }

    .grid {
        display: grid;
        column-gap: $grid_gap;
        row-gap: calc(#{$grid_gap} / 2);
        grid-template-columns: $navigation_width auto 0;
        grid-template-rows: $menubar_height minmax(0, auto);
        grid-template-areas:
            'leftbar header'
            'leftbar main';
        &.withoutsidebar {
            grid-template-rows: $menubar_height auto;
            grid-template-columns: 100%;
            grid-template-areas:
                'header'
                'main';
            .page-header {
                left: 0;
                right: 0;
            }
        }
        &.navigation {
            max-height: 100vh;
            overflow: hidden;
        }

        &.noRowGap {
            row-gap: 0;
        }

        :global(.account-button) {
            right: $grid_gap;
        }
    }

    .page-header {
        display: flex;
        grid-area: header;
        position: fixed;
        z-index: 1000;
        top: 0;
        left: calc(#{$navigation_width} + #{$grid_gap});
        right: $grid_gap;
        height: $menubar_height;
        background: var(--main-white);
        &.divider {
            border-bottom: 1px solid var(--divider-grey);
        }
    }

    .page-leftbar {
        min-height: 100vh;
        grid-area: leftbar;
        position: fixed;
        left: 0;
    }

    .page-main {
        min-height: calc(100vh - #{$menubar_height} - #{$bottom_padding});
        padding-bottom: $bottom_padding;
        grid-area: main;
        > * {
            margin: 0 auto;
            max-width: 1200px;
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
        .page-leftbar {
            min-height: auto;
            position: absolute;
        }
        .page-header {
            top: 0;
            left: 0;
            right: 0;
        }
        .page-main {
            min-height: calc(100vh - #{$menubar_height} - #{$grid_gap});
            .header {
                padding: 0 25px;
            }
            .content {
                padding: 0;
            }
        }
    }

    @media only screen and (max-width: 600px) {
        .page-header {
            left: 0;
            right: 0;
        }
    }
</style>

<div
    class="grid"
    class:navigation={accountSidebar || navigationSidebar}
    class:withoutsidebar={!displayNavigation || !$activeSession}
    class:noRowGap={!divider}
>
    <div
        class="dimmer"
        class:active={accountSidebar || navigationSidebar}
        on:click={() => {
            accountSidebar = false
            navigationSidebar = false
        }}
    />

    {#if displayNavigation && $activeSession}
        <aside class="page-leftbar">
            <NavigationSidebar bind:open={navigationSidebar} />
        </aside>
    {/if}

    <header class="page-header" class:divider>
        <NavigationSidebarButton bind:open={navigationSidebar} />
        {#if $$slots.submenu}
            <div class="submenu">
                <slot name="submenu" />
            </div>
        {/if}
        <AccountSidebarButton bind:open={accountSidebar} />
        <TokensPurchaseButton />
    </header>
    <AccountSidebar bind:open={accountSidebar} />

    <div class="page-main">
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
    </div>
</div>
