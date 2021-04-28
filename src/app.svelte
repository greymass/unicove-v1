<script lang="ts">
    import {Route, router} from 'tinro'

    import {activeSession, appReady} from '~/store'
    import {isRelease} from '~/config'

    import Page from '~/components/layout/page.svelte'

    import Login from '~/pages/login.svelte'
    import Request from '~/pages/request/index.svelte'
    import TransferSelect from '~/pages/transfer/select.svelte'
    import Transfer from '~/pages/transfer/index.svelte'
    import Tokens from '~/pages/tokens/index.svelte'
    import Resources from '~/pages/resources/index.svelte'
    import Components from './pages/_components/index.svelte'

    $: needLogin =
        $activeSession === undefined &&
        !$router.path.startsWith('/_components') &&
        !$router.path.startsWith('/request')
</script>

<style lang="scss" global>
    @import './style/reset.scss';
    @import './style/global.scss';

    #greymass-wallet-version {
        font-size: 0.2em;
        opacity: 0.2;
        position: fixed;
        bottom: 1em;
        right: 1em;
        pointer-events: none;
    }

    html {
        height: 100%;
        overflow: auto;
    }
    body {
        height: 100%;
    }

    label,
    p,
    h1,
    h2,
    h3,
    h4,
    h5,
    tr,
    td {
        color: var(--main-black);
    }

    a {
        cursor: pointer;
    }

    :root {
        --dark-grey: #b7c1cb;
        --divider-grey: #e0e6ee;
        --light-black: #2c3e50;
        --light-blue: #e0eeff;
        --light-grey: #9898b5;
        --light-red: rgba(255, 146, 30, 0.1);
        --main-black: #585d6e;
        --main-blue: #2d8eff;
        --main-grey: #f7f7fc;
        --main-red: #ff931e;
        --success-green: #4bca81;
        --error-red: #ff0033;

        --darkmode-blue: #0a84ff;
        --darkmode-dark-grey: #2c2c2e;
        --darkmode-grey: #3a3a3c;
        --darkmode-light-grey: #8e8e93;
        --darkmode-white: #eef1f5;
        --darkmode-black: #1c1c1e;

        --mobile-breakpoint: 600px;
    }

    main {
        min-height: 100vh;
    }
</style>

<svelte:head>
    <script
        async
        defer
        data-domain={isRelease ? 'wallet.greymass.com' : 'wallet-staging.greymass.com'}
        src="https://stats.greymass.com/js/plausible.js"></script>
</svelte:head>
<main>
    {#if !$appReady}
        Loading...
    {:else if needLogin}
        <Login />
    {:else}
        <Route>
            <Route path="/">
                <Tokens />
            </Route>
            <Route path="/transfer">
                <TransferSelect />
            </Route>
            <Route path="/transfer/:contract/:token" let:meta>
                <Transfer {meta} />
            </Route>
            <Route path="/request/:payload">
                <Request />
            </Route>
            <Route path="/resources/*">
                <Resources />
            </Route>
            <Route fallback>
                <Page title="Page not found">
                    <p>You shouldn't be here. Get out before it's too late.</p>
                    <img src="/images/404.jpg" alt="404" />
                </Page>
            </Route>
            {#if !isRelease}
                <Route path="/_components/*">
                    <Components />
                </Route>
            {/if}
        </Route>
    {/if}
</main>
