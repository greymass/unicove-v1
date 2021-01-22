<script lang="ts">
    import {Route, active} from 'tinro'

    import Buttons from './buttons.svelte'
    import Forms from './forms.svelte'
    import Icons from './icons.svelte'
    import Inputs from './inputs.svelte'
    import Progress from './progress.svelte'

    const routes = [
        {name: 'Buttons', path: 'buttons', component: Buttons},
        {name: 'Forms', path: 'forms', component: Forms},
        {name: 'Icons', path: 'icons', component: Icons},
        {name: 'Inputs', path: 'inputs', component: Inputs},
        {name: 'Progress Bar', path: 'progress', component: Progress},
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
    nav {
        ul {
            display: inline-flex;
            flex-wrap: wrap;
            margin-left: -8px;
            margin-top: -8px;
        }
        a {
            margin-left: 8px;
            margin-top: 8px;
            font-size: 13px;
            font-weight: 500;
            color: var(--main-blue);
            border-radius: 8px;
            display: block;
            line-height: 32px;
            background: white;
            padding: 0 10px;
            text-decoration: none;
            border: 1px solid var(--main-grey);
            &:hover {
                border-color: var(--light-blue);
            }
            &:active {
                border-color: var(--main-blue);
            }
        }
        :global(a.active) {
            background: var(--main-blue);
            color: white;
        }
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
                background-color: #e0e6ee;
                height: 1px;
            }
        }
    }
</style>

<Route path="/*">
    <header>
        <h1>Component library 🦄</h1>
        <nav>
            <ul>
                <li>
                    <a href={`/_components`} use:active exact>All</a>
                </li>
                {#each routes as route}
                    <li>
                        <a href={`/_components/${route.path}`} use:active>{route.name}</a>
                    </li>
                {/each}
            </ul>
        </nav>
    </header>
    <hr />
    <section>
        {#each routes as route}
            <Route path={`/${route.path}`}>
                <svelte:component this={route.component} />
            </Route>
        {/each}
        <Route fallback>
            {#each routes as route}
                <div class="component">
                    <h2>{route.name}</h2>
                    <hr />
                    <svelte:component this={route.component} />
                </div>
            {/each}
        </Route>
    </section>
</Route>
