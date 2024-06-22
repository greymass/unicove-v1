<script lang="ts">
    import {Route, router} from 'tinro'

    import {activeSession, appReady, darkMode} from '~/store'
    import {isRelease} from '~/config'

    import Page from '~/components/layout/page.svelte'

    import Login from '~/pages/login.svelte'
    import Dashboard from '~/pages/dashboard/index.svelte'
    import Earn from '~/pages/earn/index.svelte'
    import Request from '~/pages/request/index.svelte'
    import Send from '~/pages/send/index.svelte'
    import TokensPurchase from '~/pages/tokens/purchase/index.svelte'
    import Resources from '~/pages/resources/index.svelte'
    import Components from '~/pages/_components/index.svelte'
    import Loading from '~/pages/loading.svelte'
    import Toasts from '~/components/elements/toasts.svelte'
    import BanxaSuccess from '~/pages/banxa/success.svelte'
    import BanxaFailure from '~/pages/banxa/failure.svelte'
    import Transfer from '~/pages/transfer/index.svelte'

    $: {
        document.body.classList.toggle('darkmode', $darkMode)
        if ($darkMode) {
            document
                .querySelector('meta[name=theme-color]')
                ?.setAttribute('content', needLogin ? '#101010' : '#1c1c1e')
        } else {
            document
                .querySelector('meta[name=theme-color]')
                ?.setAttribute('content', needLogin ? '#ececec' : '#ffffff')
        }
    }

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
        --main-green: #26c64b;
        --main-grey: #f7f7fc;
        --main-red: #ff931e;

        --background-highlight: #fff;
        --background-highlight-hover: #fbfbfe;

        --dark-grey: #b7c1cb;
        --divider-grey: #e0e6ee;
        --light-black: #2c3e50;
        --light-blue: #e0eeff;
        --light-grey: #9898b5;
        --light-red: rgba(255, 146, 30, 0.1);

        --success-green: #4bca81;
        --error-red: #ff0033;

        --mobile-breakpoint: 600px;

        --melon: #f9c5b8;
        --sandy-brown: #ffa253;
        --light-goldenrod-yellow: #f5f1cc;
        --air-superiority-blue: #669bbc;
        --middle-blue-green: #7de8d1;
        --emerald: #62d385;
        --cultured: #eeeeee;
        --black: #000000;
        --white: #ffffff;

        --middle-green-eagle: #063a47;
        --lapis-lazuli: #005dac;
        --oxford-blue: #0a0e33;
        --brown-sugar: #996443;
        --antic-ruby: #82172e;
        --violet-crayola: #9d2c7a;
        --rich-black-FOGRA: #111111;

        --main-blue: var(--lapis-lazuli);
        --main-black: #585d6e;
    }

    body.darkmode {
        --main-white: #1c1c1e;
        --main-grey: #2c2c2e;

        --background-highlight: #3a3a3c;
        --background-highlight-hover: #3a3a3c57;

        --light-blue: #2a415e;
        --dark-grey: #8e8e93;
        --divider-grey: #3a3a3c;

        --melon: #063a47; /* middle green eagle */
        --sandy-brown: #005dac; /* lapis lazuli */
        --light-goldenrod-yellow: #0a0e33; /* oxford blue */
        --air-superiority-blue: #996443; /* brown sugar */
        --middle-blue-green: #82172e; /* antic ruby */
        --emerald: #9d2c7a; /* Violet Crayola */
        --cultured: #111111; /* Rich Black FOGRA */
        --black: #ffffff;
        --white: #000000;

        --middle-green-eagle: #f9c5b8; /* melon */
        --lapis-lazuli: #ffa253; /* sandy-brown */
        --oxford-blue: #f5f1cc; /* light-goldenrod-yellow */
        --brown-sugar: #669bbc; /* air-superiority-blue */
        --antic-ruby: #7de8d1; /* middle-blue-green */
        --violet-crayola: #62d385; /* emerald */
        --rich-black-FOGRA: #eeeeee; /* cultured */

        --main-blue: var(--middle-green-eagle);
        --main-black: #c4c4c4;
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
            <Route path="/earn">
                <Earn />
            </Route>
            <Route path="/send">
                <Send />
            </Route>
            <Route path="/tokens/buy">
                <TokensPurchase />
            </Route>
            <Route path="/send/:contract/:token" let:meta>
                <Send {meta} />
            </Route>
            <Route path="/request/:payload">
                <Request />
            </Route>
            <Route path="/resources/*">
                <Resources />
            </Route>
            <Route path="/banxa/success">
                <BanxaSuccess />
            </Route>
            <Route path="/banxa/failure">
                <BanxaFailure />
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
            {#if !isRelease}
                <Route path="/_components/*">
                    <Components />
                </Route>
            {/if}
        </Route>
    {/if}
    <Toasts />
</main>
