<script lang="ts">
    import type {NavigationItem} from '~/ui-types'

    import {activeBlockchain, preferences} from '~/store'

    import Icon from '~/components/elements/icon.svelte'
    import MediaQuery from '~/components/utils/media-query.svelte'
    import NavigationContent from '~/components/layout/navigation/content.svelte'
    import {ChainFeatures} from '~/config'
    import type {Readable} from 'svelte/store'
    import {derived} from 'svelte/store'

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

    const advancedNavigation: Readable<NavigationItem[]> = derived(
        [activeBlockchain],
        ([$activeBlockchain]) => {
            // List of supported features required to activate the resources section
            const resourceFeatures = [
                ChainFeatures.Staking,
                ChainFeatures.REX,
                ChainFeatures.PowerUp,
            ]
            // Items to include in the advanced section
            const items: NavigationItem[] = []
            if ($activeBlockchain) {
                if (
                    Array.from($activeBlockchain.chainFeatures).some((r) =>
                        resourceFeatures.includes(r)
                    )
                ) {
                    items.push({
                        icon: 'battery-charging',
                        name: 'Resources',
                        path: '/resources',
                    })
                }
            }
            return items
        }
    )
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
        cursor: pointer;
    }
</style>

<MediaQuery query="(max-width: 999px)" let:matches>
    <aside class:open>
        <NavigationContent
            {primaryNavigation}
            advancedNavigation={$advancedNavigation}
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
            {primaryNavigation}
            advancedNavigation={$advancedNavigation}
            {expand}
            on:collapse={() => (preferences.expandNavbar = false)}
        />
    {/if}
</MediaQuery>
