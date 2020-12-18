<script lang="ts">
    import {Route} from 'tinro'
    import {activeSession, appReady} from './store'
    import {version} from './config'

    import Page from './components/page.svelte'
    import Dashboard from './pages/dashboard.svelte'
    import Login from './pages/login.svelte'
    import Transfer from './pages/transfer.svelte'
</script>

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
</style>

<main>
    {#if !$appReady}
        Loading...
    {:else if !$activeSession}
        <Login />
    {:else}
        <Route>
            <Route path="/">
                <Dashboard />
            </Route>
            <Route path="/transfer">
                <Transfer />
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
