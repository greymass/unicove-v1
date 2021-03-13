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
            icon: 'dollar-sign',
            name: 'Tokens',
            path: '/tokens',
        },
        {
            icon: 'battery-charging',
            name: 'Resources',
            path: '/resources',
        },
    ]
</script>

<style type="scss">
    aside {
        top: 0;
        transition: left 0.3s ease-in-out;
        position: absolute;
        height: 100%;
        display: none;
        z-index: 2001;
        &.open {
            display: block;
        }
    }
    .icon {
        position: absolute;
        top: 12px;
        left: 12px;
        padding: 12px;
        color: gray;
        cursor: pointer;
    }
</style>

<MediaQuery query="(max-width: 999px)" let:matches>
    <aside class:open>
        <NavigationContent
            items={primaryNavigation}
            expand={true}
            on:collapse={() => (open = false)}
        />
    </aside>

    {#if matches}
        <span class="icon" on:click={() => (open = !open)}>
            <Icon name="menu" size="large" />
        </span>
    {:else}
        <NavigationContent
            items={primaryNavigation}
            {expand}
            on:collapse={() => (preferences.expandNavbar = false)}
        />
    {/if}
</MediaQuery>
