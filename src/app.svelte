<script lang="ts">
    import {Route} from 'tinro'
    import {activeSession, appReady} from './store'
    import {version} from './config'
    import {setupI18n, isLocaleLoaded, locale, dir} from './i18n'

    import Page from './components/page.svelte'
    import Dashboard from './pages/dashboard.svelte'
    import Login from './pages/login.svelte'
    import Transfer from './pages/transfer.svelte'
    import LocaleSwitcher from './components/locale-switcher.svelte'

    $: if (!$isLocaleLoaded) {
        setupI18n({ withLocale: 'en' })
    }

    $: { document.dir = $dir }
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
    {#if !$appReady || !$isLocaleLoaded}
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
    {#if $isLocaleLoaded}
        <LocaleSwitcher
            value={$locale}
            on:locale-changed={e => setupI18n({ withLocale: e.detail }) }
        />
    {/if}

</main>

<div id="greymass-wallet-version">Version {version}</div>
