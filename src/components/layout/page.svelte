<script lang="ts">
    import AccountSidebar from './account/sidebar.svelte'
    import Header from './header.svelte'
    import Navigation from './navigation/index.svelte'

    /** Title of the page. */
    export let title: string = ''
    export let subtitle: string = ''

    let accountSidebar = false
    let navigationSidebar = false
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
        padding: 30px;
        height: 100vh;
        min-height: 100vh;
        width: 100%;
    }

    .content {
        margin: 45px;

        h1 {
            margin-bottom: 20px;
        }
    }

    @media only screen and (max-width: 600px) {
        .content {
            margin: 55px 8px;
        }
    }
</style>

<div class="layout">
    <Navigation bind:open={navigationSidebar} />
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
            <Header {title} {subtitle} />
            <slot />
        </div>
    </div>
</div>
