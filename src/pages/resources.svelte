<script lang="ts">
    import type {API, LinkSession} from 'anchor-link'

    import {activeSession, currentAccount} from '../store'

    $: account = $currentAccount!

    import Page from '../components/page.svelte'
    import ResourcesNavigation from '../components/resources/navigation.svelte'
</script>

<Page title="Resources">
    <ResourcesNavigation />

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
            RAM: {(1 - account.ram_usage.toNumber() / account.ram_quota.toNumber()) * 100}% ({account.ram_usage}
            of {account.ram_quota})
        </li>
    </ul>
</Page>
