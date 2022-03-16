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

    import AccountCreation from '~/pages/account-creation.svelte'

    import Components from './pages/_components/index.svelte'
    import Loading from './pages/loading.svelte'
    import Toasts from '~/components/elements/toasts.svelte'

    $: document.body.classList.toggle('darkmode', $darkMode)

    $: needLogin =
        $activeSession === undefined &&
        !$router.path.startsWith('/_components') &&
        !$router.path.startsWith('/request')
</script>

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
            {#if !isRelease}
                <Route path="/_components/*">
                    <Components />
                </Route>
            {/if}
        </Route>
    {/if}
    <Toasts />
</main>
