<script lang="ts">
    import {Route} from 'tinro'
    import {activeBlockchain} from '~/store'
    import type {ChainConfig} from '~/config'
    import {ChainFeatures} from '~/config'

    import Page from '~/components/layout/page.svelte'
    import Nav from '~/components/elements/nav.svelte'

    import ResourcesOverview from '~/pages/resources/overview.svelte'
    import ResourcesFuel from '~/pages/resources/fuel.svelte'
    import ResourcesPowerUp from '~/pages/resources/powerup.svelte'
    import ResourcesRex from '~/pages/resources/rex.svelte'
    import ResourcesStaked from '~/pages/resources/staking.svelte'

    interface PotentialRoute {
        feature: ChainFeatures
        route: NavigationRoute
    }

    interface NavigationRoute {
        name: string
        path: string
        component: any
    }

    const potentialRoutes: PotentialRoute[] = [
        {
            feature: ChainFeatures.Fuel,
            route: {name: 'Fuel', path: 'fuel', component: ResourcesFuel},
        },
        {
            feature: ChainFeatures.PowerUp,
            route: {name: 'PowerUp', path: 'powerup', component: ResourcesPowerUp},
        },
        {
            feature: ChainFeatures.REX,
            route: {name: 'REX', path: 'rex', component: ResourcesRex},
        },
        {
            feature: ChainFeatures.Staking,
            route: {name: 'Staking', path: 'staking', component: ResourcesStaked},
        },
    ]

    $: routes = determineRoutes($activeBlockchain)

    function determineRoutes(blockchain: ChainConfig): NavigationRoute[] {
        const matchingRoutes: NavigationRoute[] = []
        potentialRoutes.forEach((route: PotentialRoute) => {
            if (blockchain.chainFeatures.has(route.feature)) {
                matchingRoutes.push(route.route)
            }
        })
        return matchingRoutes
    }
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
