<script lang="ts">
    import type {API, LinkSession} from 'anchor-link'

    import {activeSession} from '../../store'
    import {featureEnabled, ChainFeatures} from '../../config'

    import Page from '../../components/page.svelte'
    import ResourcesNavigation from '../../components/resources/navigation.svelte'

    let account:API.v1.AccountObject

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

<Page title="Resources - Staking">
    <ResourcesNavigation />
    {#if featureEnabled($activeSession, ChainFeatures.Staking)}
        <p>Use staking!</p>
    {:else}
        <p>This feature is unavailable on this blockchain.</p>
    {/if}
</Page>
