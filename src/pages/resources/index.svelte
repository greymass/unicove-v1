<script lang="ts">
    import {Route} from 'tinro'

    import Page from '~/components/layout/page.svelte'
    import Nav from '~/components/elements/nav.svelte'

    import ResourcesOverview from '~/pages/resources/overview.svelte'
    import ResourcesFuel from '~/pages/resources/fuel.svelte'
    import ResourcesPowerUp from '~/pages/resources/powerup.svelte'
    import ResourcesRex from '~/pages/resources/rex.svelte'
    import ResourcesStaked from '~/pages/resources/staking.svelte'

    const routes = [
        {name: 'Fuel', path: 'fuel', component: ResourcesFuel},
        {name: 'PowerUp', path: 'powerup', component: ResourcesPowerUp},
        {name: 'REX', path: 'rex', component: ResourcesRex},
        {name: 'Staking', path: 'staking', component: ResourcesStaked},
    ]
</script>

<Page title="Resources">
    <Nav {routes} home="Overview" />
    <Route path="/">
        <ResourcesOverview />
    </Route>
    {#each routes as route}
        <Route path={`/${route.path}`}>
            <svelte:component this={route.component} />
        </Route>
    {/each}
</Page>
