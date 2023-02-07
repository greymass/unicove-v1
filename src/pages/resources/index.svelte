<script lang="ts">
    import {Route} from 'tinro'
    import type {Readable} from 'svelte/store'
    import {derived} from 'svelte/store'

    import {activeBlockchain, activeSession} from '~/store'
    import {resourceFeatures} from '~/config'

    import Page from '~/components/layout/page.svelte'
    import Button from '~/components/elements/button.svelte'

    import ResourcesOverview from '~/pages/resources/pages/index.svelte'
    import ResourcesOverviewCpu from '~/pages/resources/pages/cpu.svelte'
    import ResourcesOverviewNet from '~/pages/resources/pages/net.svelte'
    import ResourcesRAMBuy from '~/pages/resources/pages/ram/buy.svelte'
    import ResourcesRAMSell from '~/pages/resources/pages/ram/sell.svelte'
    import ResourcesCPUFuel from '~/pages/resources/pages/cpu/fuel.svelte'
    import ResourcesCPUPowerUp from '~/pages/resources/pages/cpu/powerup.svelte'
    import ResourcesCPUREX from '~/pages/resources/pages/cpu/rex.svelte'
    import ResourcesNETFuel from '~/pages/resources/pages/net/fuel.svelte'
    import ResourcesNETPowerUp from '~/pages/resources/pages/net/powerup.svelte'
    import ResourcesNETREX from '~/pages/resources/pages/net/rex.svelte'
    import ResourcesCPUStaking from '~/pages/resources/pages/cpu/staking.svelte'
    import ResourcesNETStaking from '~/pages/resources/pages/net/staking.svelte'

    const enabled: Readable<boolean> = derived(activeBlockchain, ($activeBlockchain) => {
        if ($activeBlockchain) {
            return Array.from($activeBlockchain.chainFeatures).some((r) =>
                resourceFeatures.includes(r)
            )
        }
        return false
    })
</script>

{#if $activeBlockchain}
    <Page title="Network Resources" subtitle={String($activeSession?.actor)}>
        {#if $enabled}
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
            <Route path="/ram/buy">
                <ResourcesRAMBuy />
            </Route>
            <Route path="/ram/sell">
                <ResourcesRAMSell />
            </Route>
            <!-- Staking -->
            <Route path="/cpu/stake">
                <ResourcesCPUStaking />
            </Route>
            <Route path="/net/stake">
                <ResourcesNETStaking />
            </Route>
        {:else}
            <p>Resource management not available on the {$activeBlockchain.name} blockchain.</p>
            <Button href="/">Back to Dashboard</Button>
        {/if}
    </Page>
{/if}
