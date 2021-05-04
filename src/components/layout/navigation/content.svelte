<script lang="ts">
    import {createEventDispatcher} from 'svelte'
    import {router} from 'tinro'

    import {version, isRelease} from '~/config'
    import {preferences} from '~/store'
    import type {NavigationItem} from '~/ui-types'

    import Icon from '~/components/elements/icon.svelte'

    // Dispatched when button is activated via keyboard or click
    const dispatch = createEventDispatcher<{collapse: boolean}>()

    $: currentPath = $router.path
    $: expandAdvanced = $preferences.expandNavbarAdvanced

    export let expand = true

    export let primaryNavigation: NavigationItem[] = []
    export let advancedNavigation: NavigationItem[] = []

    const pathMatches = (item: NavigationItem): boolean => {
        if (item.exactPath) {
            return currentPath === item.path
        }
        return currentPath.startsWith(item.path)
    }
</script>

<style type="scss">
    .navigation {
        align-self: stretch;
        background-color: var(--main-grey);
        display: flex;
        flex-direction: column;
        width: 97px;
        min-width: 97px;
        max-width: 97px;
        padding: 26px;
        height: 100%;
        border-right-width: 2px;
        align-items: center;
        > * {
            width: 100%;
        }
        &.expanded {
            width: 268px;
            min-width: 268px;
            max-width: 268px;
            .items {
                max-width: 100%;
                .item {
                    color: var(--main-blue);
                    padding: 0 10px;
                    .icon {
                        flex-grow: 0;
                        margin-right: 12px;
                    }
                    .name {
                        display: flex;
                        flex-grow: 1;
                    }
                    &.advanced {
                        padding-left: 2em;
                    }
                }
            }
        }
        .title {
            color: var(--dark-grey);
            font-size: 12px;
            display: inline-block;
            padding-bottom: 24px;
            margin-bottom: 24px;
            text-align: center;
            border-bottom: 1px solid gray;
            span {
                padding: 12px;
                cursor: pointer;
            }
        }
        .items {
            flex-grow: 1;
            max-width: 32px;
            .item {
                border-radius: 4px;
                color: var(--main-blue);
                cursor: pointer;
                display: flex;
                font-size: 13px;
                line-height: 32px;
                min-height: 32px;
                margin: 12px auto;
                text-decoration: none;
                &.active {
                    background-color: var(--background-highlight);
                    color: var(--main-black);
                }
                .name {
                    display: none;
                }
                .icon {
                    flex-grow: 1;
                    text-align: center;
                }
            }
        }
    }
</style>

<div class="navigation" class:expanded={expand}>
    <div class="title">
        {#if expand}
            Greymass Wallet
            {#if !isRelease}
                - {version}
            {/if}
            <span on:click={() => dispatch('collapse', false)}>
                <Icon name="x" />
            </span>
        {:else}
            <span on:click={() => (preferences.expandNavbar = true)}>
                <Icon name="menu" />
            </span>
        {/if}
    </div>
    <div class="items">
        {#each primaryNavigation as item}
            <a href={item.path} class="item" class:active={pathMatches(item)}>
                <span class="icon">
                    <Icon name={item.icon} />
                </span>
                <span class="name">{item.name}</span>
            </a>
        {/each}
        {#if advancedNavigation.length > 0}
            <div class="item" on:click={() => (preferences.expandNavbarAdvanced = !expandAdvanced)}>
                <span class="icon">
                    <Icon name={expandAdvanced ? 'chevron-down' : 'chevron-right'} />
                </span>
                <span class="name">Advanced</span>
            </div>
            {#if expandAdvanced}
                {#each advancedNavigation as item}
                    <a href={item.path} class="item advanced" class:active={pathMatches(item)}>
                        <span class="icon">
                            <Icon name={item.icon} />
                        </span>
                        <span class="name">{item.name}</span>
                    </a>
                {/each}
            {/if}
        {/if}
    </div>
    <!-- <div class="footer">
        <h2>Support</h2>
        <a href="#feedback"> Feedback </a>
        <br />
        <a href="#about" class="info-icon"> About </a>
    </div> -->
</div>
