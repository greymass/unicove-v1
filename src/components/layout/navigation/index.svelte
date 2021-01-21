<script lang="ts">
    import type {NavigationItem} from '~/ui-types'
    import MediaQuery from '~/components/utils/media-query.svelte'

    import NavigationDesktop from './desktop/index.svelte'
    import NavigationMobile from './mobile/index.svelte'
    import NavigationMobileIcon from './mobile/icon.svelte'

    export let open = false

    const primaryNavigation: NavigationItem[] = [
        {
            exactPath: true,
            icon: 'dashboard',
            name: 'Dashboard',
            path: '/',
        },
        {
            icon: 'transfer',
            name: 'Transfer',
            path: '/transfer',
        },
        {
            icon: 'resources',
            name: 'Resources',
            path: '/resources',
        },
    ]
</script>

<style>
</style>

<MediaQuery query="(max-width: 999px)" let:matches>
    <NavigationMobile items={primaryNavigation} bind:open />
    {#if matches}
        <NavigationMobileIcon bind:open />
    {:else}
        <NavigationDesktop items={primaryNavigation} />
    {/if}
</MediaQuery>
