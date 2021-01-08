<script lang="ts">
    import {Route} from 'tinro'
    import {activeBlockchain, activeSession, appReady} from './store'
    import {version} from './config'

    import Page from './components/layout.svelte'
    import Dashboard from './pages/dashboard.svelte'
    import Login from './pages/login.svelte'
    import Transfer from './pages/transfer.svelte'
    import Resources from './pages/resources.svelte'
    import ResourcesFuel from './pages/resources/fuel.svelte'
    import ResourcesPowerUp from './pages/resources/powerup.svelte'
    import ResourcesRex from './pages/resources/rex.svelte'
    import ResourcesStaked from './pages/resources/staking.svelte'
</script>

<svelte:head>
</svelte:head>

<style lang="scss" global>
    @import 'style/global.scss';
    #greymass-wallet-version {
        font-size: 0.2em;
        opacity: 0.2;
        position: fixed;
        bottom: 1em;
        right: 1em;
        pointer-events: none;
    }

    :global(:root){
       --main-blue: #2D8EFF;
       --main-grey: #F7F7FC;
       --main-black: #585D6E;
    }
</style>

<main class="h-full">
    {#if !$appReady}
        Loading...
    {:else if !$activeSession || !$activeBlockchain}
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
        </Route>
    {/if}
</main>

<div id="greymass-wallet-version">Version {version}</div>
