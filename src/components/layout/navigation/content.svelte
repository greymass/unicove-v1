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
    export let floating = false

    export let primaryNavigation: NavigationItem[] = []
    export let advancedNavigation: NavigationItem[] = []

    function handleHamburger() {
        if (expand) {
            dispatch('collapse', false)
        } else {
            preferences.expandNavbar = true
        }
    }

    const pathMatches = (item: NavigationItem): boolean => {
        if (item.exactPath) {
            return currentPath === item.path
        }
        return currentPath.startsWith(item.path)
    }
</script>

<style type="scss">
    nav {
        transition: 300ms ease-in-out;
        transition-property: width, min-width;
        background-color: var(--main-grey);
        padding: 26px;
        width: 268px;
        min-width: 268px;
        height: 100%;
<<<<<<< HEAD
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
=======
        header {
            color: var(--dark-grey);
            font-weight: 600;
            height: 46px;
            display: flex;
            overflow: hidden;
            .title {
                transition: 200ms all ease-out;
                flex-grow: 1;
                white-space: nowrap;
                margin-right: 1em;
                margin-top: 2px;
                .version {
                    font-family: Inter;
                    font-style: normal;
                    font-weight: 500;
                    font-size: 10px;
                    line-height: 250%;
                    letter-spacing: -0.04px;
>>>>>>> abecd81... Polish navigation style
                }
            }
            .button {
                color: var(--main-blue);
                cursor: pointer;
            }
            border-bottom: 1px solid var(--divider-grey);
        }

        ul {
            margin-top: 26px;
            li {
                border-radius: 8px;
                a {
                    color: var(--main-blue);
                    display: flex;
                    text-decoration: none;
                    height: 32px;
                    align-items: center;
                    font-weight: 500;
                }
                margin-bottom: 8px;
                &:hover {
                    background-color: var(--background-highlight-hover);
                }
                &.active {
                    background-color: var(--background-highlight);
                    border-radius: 8px;
                    a {
                        color: var(--main-black);
                    }
                }
<<<<<<< HEAD
=======
                .icon {
                    padding: 0 10px;
                }
>>>>>>> abecd81... Polish navigation style
                .name {
                    padding-left: 5px;
                }
            }
        }

        &.collapsed {
            width: 97px;
            min-width: 97px;
            header {
                justify-content: center;
            }
            ul li a {
                justify-content: center;
                .name {
                    display: none;
                }
            }
        }

        &.floating {
            position: fixed;
            z-index: 2001;
        }
    }
</style>

<nav class:collapsed={!expand} class:floating>
    <header>
        {#if expand}
            <div class="title">
                <div>Greymass Wallet</div>
                {#if !isRelease}
                    <div class="version">
                        {version}
                    </div>
                {/if}
            </div>
        {/if}
        <span class="button" on:click={handleHamburger}>
            {#if expand}
                <Icon name="x" />
            {:else}
                <Icon name="menu" />
            {/if}
        </span>
    </header>
    <ul>
        {#each primaryNavigation as item}
            <li class:active={pathMatches(item)}>
                <a href={item.path}>
                    <span class="icon">
                        <Icon name={item.icon} />
                    </span>
                    <span class="name">{item.name}</span>
                </a>
            </li>
        {/each}
        <li>
            <ul>
                {#each advancedNavigation as item}
                    <li class:active={pathMatches(item)}>
                        <a href={item.path}>
                            <span class="icon">
                                <Icon name={item.icon} />
                            </span>
                            <span class="name">{item.name}</span>
                        </a>
                    </li>
                {/each}
            </ul>
        </li>
    </ul>
</nav>
