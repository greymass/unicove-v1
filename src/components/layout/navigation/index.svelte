<script lang="ts">
    import type {Readable} from 'svelte/store'
    import {derived} from 'svelte/store'

    import {resourceFeatures} from '~/config'
    import {activeBlockchain, preferences} from '~/store'
    import type {NavigationItem} from '~/ui-types'
    import {banxaIsAvailable} from '~/lib/banxa'
    import {rexIsAvailable} from '~/lib/rex'

    import MediaQuery from '~/components/utils/media-query.svelte'
    import NavigationContent from '~/components/layout/navigation/content.svelte'

    export let open = false
    $: expand = $preferences.expandNavbar

    $: primaryNavigation = [
        {
            exactPath: true,
            icon: 'layout',
            name: 'Dashboard',
            path: '/',
        },
        {
            icon: 'arrow-right',
            name: 'Send & Receive',
            path: '/send',
        },
        {
            icon: 'repeat',
            name: 'Transfer',
            path: '/transfer',
        },
        ...(rexIsAvailable($activeBlockchain)
            ? [
                  {
                      icon: 'battery-charging',
                      name: 'Earn',
                      path: '/earn',
                  },
              ]
            : []),

        ...(banxaIsAvailable($activeBlockchain)
            ? [
                  {
                      icon: 'credit-card',
                      name: 'Get Tokens',
                      path: '/tokens/buy',
                  },
              ]
            : []),
    ]

    const advancedNavigation: Readable<NavigationItem[]> = derived(
        [activeBlockchain],
        ([$activeBlockchain]) => {
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
</style>

<MediaQuery query="(max-width: 999px)" let:matches>
    {#if !matches || open}
        <NavigationContent
            {primaryNavigation}
            advancedNavigation={$advancedNavigation}
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
    {/if}
</MediaQuery>
