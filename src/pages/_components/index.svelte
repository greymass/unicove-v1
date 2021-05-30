<script lang="ts">
    import {Route} from 'tinro'

    import Buttons from './buttons.svelte'
    import Forms from './forms.svelte'
    import Icons from './icons.svelte'
    import Inputs from './inputs.svelte'
    import Progress from './progress.svelte'
    import Modals from './modals.svelte'
    import Segments from './segments.svelte'
    import TxFollower from './tx-follower.svelte'

    import Nav from '~/components/elements/nav.svelte'
    import Page from '~/components/layout/page.svelte'

    const routes = [
        {name: 'Buttons', path: 'buttons', component: Buttons},
        {name: 'Forms', path: 'forms', component: Forms},
        {name: 'Icons', path: 'icons', component: Icons},
        {name: 'Inputs', path: 'inputs', component: Inputs},
        {name: 'Progress Bar', path: 'progress', component: Progress},
        {name: 'Modals', path: 'modals', component: Modals},
        {name: 'Segments', path: 'segment', component: Segments},
    ]
</script>

<style type="scss">
    h1 {
        font-size: 24px;
        font-weight: bold;
        letter-spacing: -0.47px;
        margin-bottom: 16px;
    }
    header {
        display: flex;
        flex-direction: column;
        padding: 16px;
        background-color: var(--main-grey);
    }
    hr {
        margin: 0;
        border-style: solid;
        color: var(--light-blue);
    }
    section {
        margin: 16px;
        .component {
            margin-bottom: 32px;
            h2 {
                font-size: 16px;
                font-weight: 600;
                letter-spacing: -0.18px;
                margin-bottom: 8px;
            }
            hr {
                margin: 8px -8px 16px;
                border: 0;
                height: 1px;
            }
        }
    }
</style>

<Route path="/*">
    <header>
        <h1>Component library 🦄</h1>
        <Nav {routes} home="Overview" />
    </header>
    <section>
        <Route path="/">
            {#each routes as route}
                {#if !route.excludeFromAll}
                    <div class="component">
                        <h2>{route.name}</h2>
                        <hr />
                        <svelte:component this={route.component} />
                    </div>
                {/if}
            {/each}
        </Route>
        {#each routes as route}
            <Route path={`/${route.path}`}>
                <div class="component">
                    <h2>{route.name}</h2>
                    <hr />
                    <svelte:component this={route.component} />
                </div>
            </Route>
        {/each}
    </section>
</Route>
