<script lang="ts">
    import type {API, LinkSession} from 'anchor-link'

    import {activeSession} from '../store'

    import Page from '../components/layout.svelte'
    import ResourcesNavigation from '../components/resources/navigation.svelte'

    let account:API.v1.AccountObject

    // TODO: we need some sort of global account store/cache instead of pulling it every page load
    async function loadAccount(session: LinkSession) {
        account = await session.client.v1.chain.get_account(session.auth.actor)
        return account
    }

    // load account based on active session
    $: loading = loadAccount($activeSession!)
</script>

<Page title="Resources">
    <ResourcesNavigation />
    {#await loading}
        <p>Hang on, fetching balances and stuff...</p>
    {:then _}
        Available Resources
        <ul>
            <li>
                CPU: {(1 - account.cpu_limit.used.toNumber() / account.cpu_limit.max.toNumber()) * 100}%
                ({account.cpu_limit.used} of {account.cpu_limit.max})
            </li>
            <li>
                NET: {(1 - account.net_limit.used.toNumber() / account.net_limit.max.toNumber()) * 100}%
                ({account.net_limit.used} of {account.net_limit.max})
            </li>
            <li>
                RAM: {(1 - account.ram_usage.toNumber() / account.ram_quota.toNumber()) * 100}%
                ({account.ram_usage} of {account.ram_quota})
            </li>
        </ul>
    {/await}
</Page>
