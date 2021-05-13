<script lang="ts">
    import type {NavigationItem} from '~/ui-types'

    import {preferences} from '~/store'

    import Icon from '~/components/elements/icon.svelte'
    import MediaQuery from '~/components/utils/media-query.svelte'
    import NavigationContent from '~/components/layout/navigation/content.svelte'

    export let open = false
    $: expand = $preferences.expandNavbar

    const primaryNavigation: NavigationItem[] = [
        {
            exactPath: true,
            icon: 'layout',
            name: 'Dashboard',
            path: '/',
        },
        {
            icon: 'arrow-right',
            name: 'Transfer',
            path: '/transfer',
        },
    ]

    const advancedNavigation: NavigationItem[] = [
        {
            icon: 'battery-charging',
            name: 'Resources',
            path: '/resources',
        },
    ]
</script>

<style type="scss">
    .hamburger {
        position: fixed;
        top: 12px;
        left: 12px;
        padding: 12px;
        cursor: pointer;
    }
</style>

<MediaQuery query="(max-width: 999px)" let:matches>
    {#if !matches || open}
        <NavigationContent
            {primaryNavigation}
            {advancedNavigation}
            expand={matches || expand}
            floating={matches}
            on:collapse={() => {
                if (matches) {
                    open = false
                } else {
                    preferences.expandNavbar = false
                }
            }}
        />
    {:else}
        <span class="hamburger" on:click={() => (open = !open)}>
            <Icon name="menu" size="large" />
        </span>
    {/if}
</MediaQuery>
