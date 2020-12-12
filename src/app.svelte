<script lang="ts">
    import {Route} from 'tinro'
    import {activeSession, appReady} from './store'

    import Page from './components/page.svelte'
    import Dashboard from './pages/dashboard.svelte'
    import Login from './pages/login.svelte'
    import Transfer from './pages/transfer.svelte'
</script>

<style lang="scss" global>
    @import 'style/global.scss';
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
