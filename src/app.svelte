<script lang="ts">
    import {Route, router} from 'tinro'

    import {activeSession, appReady, darkMode} from '~/store'
    import {isRelease} from '~/config'

    import Page from '~/components/layout/page.svelte'

    import Login from '~/pages/login.svelte'
    import Dashboard from '~/pages/dashboard/index.svelte'
    import Request from '~/pages/request/index.svelte'
    import Transfer from '~/pages/transfer/index.svelte'
    import Resources from '~/pages/resources/index.svelte'
    import Loading from './pages/loading.svelte'

    let Components: any
    if (!isRelease) {
        import('./pages/_components/index.svelte').then((component) => {
            Components = component
        })
    }

    $: document.body.classList.toggle('darkmode', $darkMode)

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
        --main-white: #fff;
        --always-white: var(--main-white);
        --main-black: #585d6e;
        --main-blue: #2d8eff;
        --main-green: #26c64b;
        --main-grey: #f7f7fc;
        --main-red: #ff931e;

        --background-highlight: #fff;
        --background-highlight-hover: rgba(255, 255, 255, 0.3);

        --dark-grey: #b7c1cb;
        --divider-grey: #e0e6ee;
        --light-black: #2c3e50;
        --light-blue: #e0eeff;
        --light-grey: #9898b5;
        --light-red: rgba(255, 146, 30, 0.1);

        --success-green: #4bca81;
        --error-red: #ff0033;

        --mobile-breakpoint: 600px;
    }

    body.darkmode {
        --main-white: #1c1c1e;
        --main-black: #eef1f5;
        --main-blue: #0a84ff;
        --main-grey: #2c2c2e;

        --background-highlight: #3a3a3c;
        --background-highlight-hover: #3a3a3c57;

        --light-blue: #3a3a3c;
        --dark-grey: #8e8e93;
        --divider-grey: #3a3a3c;
    }

    body {
        background: var(--main-white);
        color: var(--main-black);
        height: 100%;
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
        src="https://stats.greymass.com/js/plausible.exclusions.js"
        data-exclude="/account/*, /request/*"></script>
</svelte:head>
<main>
    {#if !$appReady}
        <Loading />
    {:else if needLogin}
        <Login />
    {:else}
        <Route>
            <Route path="/">
                <Dashboard />
            </Route>
            <Route path="/transfer">
                <Transfer />
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
            <Route path="/_components/*">
                {#if Components}
                    <Components />
                {/if}
            </Route>
        </Route>
    {/if}
</main>
