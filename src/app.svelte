<script lang="ts">
    import {Route, router} from 'tinro'
    import {activeSession, appReady} from '~/store'
    import {isRelease} from '~/config'

    import Page from '~/components/layout/page.svelte'

    import Dashboard from '~/pages/dashboard.svelte'
    import Login from '~/pages/login.svelte'
    import Transfer from '~/pages/transfer.svelte'
    import Resources from '~/pages/resources/index.svelte'
    import Components from './pages/_components/index.svelte'

    $: needLogin = $activeSession === null && !$router.path.startsWith('/_components')
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

    :root {
        --main-white: #fff;
        --main-blue: #2d8eff;
        --main-grey: #f7f7fc;
        --main-black: #585d6e;
        --main-red: #ff931e;
        --light-black: #2c3e50;
        --light-grey: #9898b5;
        --light-red: rgba(255, 146, 30, 0.1);
        --light-blue: #e0eeff;
        --light-black: #585d6e;
        --dark-grey: #b7c1cb;
        --divider-grey: #e0e6ee;
    }

    main {
        height: 100vh;
    }
</style>

<svelte:head />
<main>
    {#if !$appReady}
        Loading...
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
