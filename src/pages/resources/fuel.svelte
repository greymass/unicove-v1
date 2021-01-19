<script lang="ts">
    import type {API, LinkSession} from 'anchor-link'

    import {activeBlockchain, activeSession} from '~/store'
    import {ChainFeatures} from '~/config'

    import Page from '~/components/layout/page.svelte'
    import ResourcesNavigation from './components/navigation.svelte'

    let account: API.v1.AccountObject

    // TODO: we need some sort of global account store/cache instead of pulling it every page load
    async function loadAccount(session: LinkSession) {
        account = await session.client.v1.chain.get_account(session.auth.actor)
        return account
    }

    // load account based on active session
    $: loading = loadAccount($activeSession!)
</script>

<style>
</style>

<Page title="Resources - Fuel">
    <ResourcesNavigation />
    {#await loading}
        <p>Hang on, fetching balances and stuff...</p>
    {:then _}
        {#if $activeBlockchain.chainFeatures.has(ChainFeatures.Fuel)}
            <ul />
        {:else}
            <p>This feature is unavailable on this blockchain.</p>
        {/if}
    {/await}
</Page>
