<script lang="ts">
    import type {SessionLike} from '~/auth'
    import {sessionEquals, login, logout} from '~/auth'
    import {chainConfig} from '~/config'
    import {activeSession, availableSessions} from '~/store'

    import Button from '~/components/elements/button.svelte'
    import Icon from '~/components/elements/icon.svelte'

    $: isActive = (session: SessionLike) => sessionEquals(session, $activeSession!)

    export let onSelect: (session: SessionLike) => void

    function handleAdd() {
        login().catch((error: any) => {
            // TODO: some sort of modal or toast for error messages like these
            console.warn('unable to add account', error)
        })
    }

    const chainIds: string[] = [
        ...new Set($availableSessions.map((session) => String(session.chainId))),
    ]

    interface SessionGroup {
        chainId: string
        name: string
        sessions: SessionLike[]
    }

    const groupings: SessionGroup[] = chainIds
        .map((chainId) => {
            const config = chainConfig(chainId)
            return {
                chainId,
                name: config.name,
                sessions: $availableSessions.filter((s) => String(s.chainId) === chainId),
            }
        })
        .sort((a: SessionGroup, b: SessionGroup) => a.name.localeCompare(b.name))
</script>

<style type="scss">
    $borderRadius: 8px;
    .list {
        margin: 10px;
        ul {
            list-style-type: none;
            padding: 0 10px;
            li {
                cursor: pointer;
                color: var(--main-blue);
                display: flex;
                font-size: 13px;
                font-weight: 500;
                line-height: 33px;
                margin: 10px 0;
                user-select: none;
                text-decoration: none;
                &.active {
                    background-color: white;
                    border-radius: $borderRadius;
                    color: var(--light-black);
                    font-weight: 600;
                    > .icon,
                    > .control {
                        color: var(--main-blue);
                    }
                    .control {
                        display: flex;
                    }
                }
                &.add-account {
                    flex-direction: column;
                    line-height: 1em;
                    margin-top: 2em;
                }
                &.network {
                    color: var(--dark-grey);
                    font-size: 10px;
                    font-weight: 600;
                    line-height: 1em;
                }
                > div {
                    order: 0;
                    flex: 0 1 auto;
                    &.icon {
                        color: var(--main-blue);
                        padding: 0 8px;
                    }
                    &.account {
                        flex: 1 1 auto;
                        padding: 0 2px;
                    }
                    &.control {
                        display: none;
                        align-items: center;
                        justify-content: center;
                        margin: 0 10px;
                    }
                }
            }
        }
    }
</style>

<div class="list">
    <ul>
        {#each groupings as group}
            <li class="network">{group.name}</li>
            {#each group.sessions as session}
                <li class:active={isActive(session)}>
                    <div class="icon" on:click={() => onSelect(session)}>
                        <Icon name={isActive(session) ? 'user-check' : 'user'} />
                    </div>
                    <div class="account" on:click={() => onSelect(session)}>
                        {session.auth.actor}
                    </div>
                    <div class="control" on:click={() => logout(session)}>
                        <Icon name="log-out" size="large" />
                    </div>
                </li>
            {/each}
        {/each}
        <li class="add-account">
            <Button primary on:action={handleAdd}>Add another Account</Button>
        </li>
    </ul>
</div>
