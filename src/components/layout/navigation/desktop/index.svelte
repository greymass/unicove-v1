<script lang="ts">
    import {router} from 'tinro'

    import {version, isRelease} from '~/config'
    import {preferences} from '~/store'
    import type {NavigationItem} from '~/ui-types'

    import xBlueIcon from '@/images/x-blue.svg'
    import infoBlueIcon from '@/images/info-blue.svg'

    $: currentPath = $router.path
    $: expand = $preferences.expandNavbar

    export let items: NavigationItem[] = []

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
                    padding: 0 10px;
                    .icon {
                        flex-grow: 0;
                        margin-right: 12px;
                    }
                    .name {
                        display: flex;
                        flex-grow: 1;
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
            img {
                cursor: pointer;
                display: inline-block;
                width: 13px;
                margin: 5px 0 -3px 10px;
            }
        }
        .items {
            flex-grow: 1;
            max-width: 32px;
            .item {
                border-radius: 4px;
                color: var(--main-blue);
                display: flex;
                font-size: 13px;
                line-height: 32px;
                min-height: 32px;
                margin: 12px auto;
                text-decoration: none;
                &.active {
                    background-color: white;
                    color: var(--main-black);
                }
                .name {
                    display: none;
                }
                .icon {
                    flex-grow: 1;
                    width: 32px;
                    height: 32px;
                    max-height: 32px;
                    background-color: var(--main-black);
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
            <img alt="close" src={xBlueIcon} on:click={() => (preferences.expandNavbar = false)} />
        {:else}
            <img alt="open" src={infoBlueIcon} on:click={() => (preferences.expandNavbar = true)} />
        {/if}
    </div>
    <div class="items">
        {#each items as item}
            <a href={item.path} class="item" class:active={pathMatches(item)}>
                <span class="icon" />
                <span class="name">{item.name}</span>
            </a>
        {/each}
    </div>
    <!-- <div class="footer">
        <h2>Support</h2>
        <a href="#feedback"> Feedback </a>
        <br />
        <a href="#about" class="info-icon"> About </a>
    </div> -->
</div>
