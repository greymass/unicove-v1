<script lang="ts">
    import {Route} from 'tinro'

    import Page from '~/components/layout/page.svelte'

    import ResourcesOverview from '~/pages/resources/pages/index.svelte'
    import ResourcesOverviewCpu from '~/pages/resources/pages/cpu.svelte'
    import ResourcesOverviewNet from '~/pages/resources/pages/net.svelte'
    import ResourcesOverviewRam from '~/pages/resources/pages/ram.svelte'
    import ResourcesCPUFuel from '~/pages/resources/pages/cpu/fuel.svelte'
    import ResourcesCPUPowerUp from '~/pages/resources/pages/cpu/powerup.svelte'
    import ResourcesCPUREX from '~/pages/resources/pages/cpu/rex.svelte'
    import ResourcesNETFuel from '~/pages/resources/pages/net/fuel.svelte'
    import ResourcesNETPowerUp from '~/pages/resources/pages/net/powerup.svelte'
    import ResourcesNETREX from '~/pages/resources/pages/net/rex.svelte'
    import ResourcesCPUStaking from '~/pages/resources/pages/cpu/staking.svelte'
    import ResourcesNETStaking from '~/pages/resources/pages/net/staking.svelte'
</script>

<Page title="Network Resources">
    <Route path="/">
        <ResourcesOverview />
    </Route>
    <!-- CPU -->
    <Route path="/cpu">
        <ResourcesOverviewCpu />
    </Route>
    <Route path="/cpu/fuel">
        <ResourcesCPUFuel />
    </Route>
    <Route path="/cpu/powerup">
        <ResourcesCPUPowerUp />
    </Route>
    <Route path="/cpu/rex">
        <ResourcesCPUREX />
    </Route>
    <!-- NET -->
    <Route path="/net">
        <ResourcesOverviewNet />
    </Route>
    <Route path="/net/fuel">
        <ResourcesNETFuel />
    </Route>
    <Route path="/net/powerup">
        <ResourcesNETPowerUp />
    </Route>
    <Route path="/net/rex">
        <ResourcesNETREX />
    </Route>
    <!-- RAM -->
    <Route path="/ram">
        <ResourcesOverviewRam />
    </Route>
    <!-- Staking -->
    <Route path="/cpu/stake">
        <ResourcesCPUStaking />
    </Route>
    <Route path="/net/stake">
        <ResourcesNETStaking />
    </Route>
</Page>
