<script lang="ts">
    import {Route, router} from 'tinro'
    import {activeSession, appReady} from '~/store'
    import {version, isRelease} from '~/config'

    import Page from '~/components/layout/page.svelte'

    import Dashboard from '~/pages/dashboard.svelte'
    import Login from '~/pages/login.svelte'
    import Transfer from '~/pages/transfer.svelte'
    import Resources from '~/pages/resources/index.svelte'
    import ResourcesFuel from '~/pages/resources/fuel.svelte'
    import ResourcesPowerUp from '~/pages/resources/powerup.svelte'
    import ResourcesRex from '~/pages/resources/rex.svelte'
    import ResourcesStaked from '~/pages/resources/staking.svelte'
    import Components from './pages/_components/index.svelte'

    $: needLogin = $activeSession === null && !$router.path.startsWith('/_components')
</script>

<style lang="scss" global>
    @import './style/reset.scss';
    @import './style/global.scss';

    main {
        height: 100%;
    }

    #greymass-wallet-version {
        font-size: 0.2em;
        opacity: 0.2;
        position: fixed;
        bottom: 1em;
        right: 1em;
        pointer-events: none;
    }

    :global(:root) {
        --main-blue: #2d8eff;
        --main-grey: #f7f7fc;
        --main-black: #585d6e;
        --light-black: #2c3e50;
        --light-grey: #9898b5;
        --dark-grey: #b7c1cb;
        --light-blue: #e0eeff;
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
            <Route path="/resources/*" firstmatch>
                <Route path="/">
                    <Resources />
                </Route>
                <Route path="/fuel">
                    <ResourcesFuel />
                </Route>
                <Route path="/powerup">
                    <ResourcesPowerUp />
                </Route>
                <Route path="/rex">
                    <ResourcesRex />
                </Route>
                <Route path="/staking">
                    <ResourcesStaked />
                </Route>
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

{#if !isRelease}
    <div id="greymass-wallet-version">Version {version}</div>
{/if}
