<script lang="ts">
    import {activeSession, preferences} from '~/store'

    import AccountSidebar from '~/components/layout/account/sidebar.svelte'
    import Header from '~/components/layout/header.svelte'
    import Navigation from '~/components/layout/navigation/index.svelte'

    /** Title of the page. */
    export let title: string = ''
    export let subtitle: string = ''

    let accountSidebar = false
    let navigationSidebar = false

    $: darkmode = $preferences.darkmode
</script>

<style type="scss">
    .layout {
        display: flex;
        flex: 1;
        height: 100vh;
    }

    .dimmer {
        display: none;
        position: absolute;
        height: 100vh;
        width: 100vw;
        left: 0;
        top: 0;
        z-index: 1000 !important;
        background-color: rgba(0, 0, 0, 0.25);
        &.active {
            display: block;
        }
    }

    .main {
        flex-grow: 1;
        min-height: 100vh;
        width: 100%;
        overflow: auto;
    }

    .header {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        width: 100%;
    }

    .controls,
    .title {
        display: flex;
        flex-direction: column;
        flex-basis: 100%;
        flex: 1;
    }

    .darkmode {
        :global(label),
        :global(p),
        :global(h1),
        :global(h2),
        :global(h3),
        :global(h4),
        :global(h5),
        :global(tr),
        :global(td) {
            color: var(--darkmode-white);
        }
        .main {
            background: var(--darkmode-black);
            color: var(--darkmode-white);
        }
    }

    .content {
        margin: 80px 45px 0;
    }

    @media only screen and (max-width: 600px) {
        .content {
            margin: 80px 10px 0;
        }
    }
</style>

<div class="layout" class:darkmode>
    {#if $activeSession}
        <Navigation bind:open={navigationSidebar} />
    {/if}
    <AccountSidebar bind:open={accountSidebar} />
    <div
        class="dimmer"
        class:active={accountSidebar || navigationSidebar}
        on:click={() => {
            accountSidebar = false
            navigationSidebar = false
        }}
    />

    <div class="main">
        <div class="content">
            <div class="header">
                <div class="title">
                    <Header {title} {subtitle} />
                </div>
                {#if $$slots.controls}
                    <div class="controls">
                        <slot name="controls" />
                    </div>
                {/if}
            </div>
            <slot />
        </div>
    </div>
</div>
