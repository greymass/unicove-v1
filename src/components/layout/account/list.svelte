<script lang="ts">
    import {ChainId} from 'anchor-link'
    import {derived} from 'svelte/store'
    import type {Readable} from 'svelte/store'

    import type {SessionLike} from '~/auth'
    import {sessionEquals, login, logout} from '~/auth'
    import {chains, chainConfig} from '~/config'
    import {activeSession, availableSessions} from '~/store'

    import Button from '~/components/elements/button.svelte'
    import ButtonLogin from '~/components/elements/button/login.svelte'
    import Icon from '~/components/elements/icon.svelte'
    import Segment from '~/components/elements/segment.svelte'
    import Text from '~/components/elements/text.svelte'

    $: isActive = (session: SessionLike) => sessionEquals(session, $activeSession!)

    export let onSelect: (session: SessionLike) => void

    function handleAdd() {
        login().catch((error: any) => {
            // TODO: some sort of modal or toast for error messages like these
            console.warn('unable to add account', error)
        })
    }

    interface SessionGroup {
        chainId: string
        name: string
        sessions: SessionLike[]
    }

    const getGroupings = (chainIds: string[]) =>
        chainIds
            .map((chainId) => {
                const config = chainConfig(ChainId.from(chainId))
                return {
                    chainId,
                    name: config.name,
                    sessions: $availableSessions.filter((s) => String(s.chainId) === chainId),
                }
            })
            .sort((a: SessionGroup, b: SessionGroup) => a.name.localeCompare(b.name))

    const groupings: Readable<SessionGroup[]> = derived(availableSessions, ($availableSessions) => {
        if ($availableSessions) {
            const chainIds = [
                ...new Set($availableSessions.map((session) => String(session.chainId))),
            ]
            return getGroupings(chainIds)
        }
        return []
    })

    export let collapsed: any = {}

    function toggle(chainId: string) {
        if (collapsed[chainId] !== true) {
            collapsed[chainId] = true
        } else {
            collapsed[chainId] = false
        }
    }
</script>

<style type="scss">
    $borderRadius: 8px;

    .list {
        margin: 10px;
        .add-account {
            padding: 0 16px;
        }
        .network {
            .header {
                color: var(--dark-grey);
                cursor: pointer;
                display: flex;
                justify-content: space-between;
                font-size: 12px;
                font-weight: 600;
                line-height: 12px;
                padding: 6px 10px;
                margin-top: 26px;
                user-select: none;
            }
            .accounts {
                list-style-type: none;
                padding: 0 16px;
                &.collapsed {
                    display: none;
                }
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
                        background-color: var(--background-highlight);
                        color: var(--main-black);
                        border-radius: $borderRadius;
                        font-weight: 600;
                        > .icon,
                        > .control {
                            color: var(--main-blue);
                        }
                        .control {
                            display: flex;
                        }
                    }
                    > div {
                        order: 0;
                        flex: 0 1 auto;
                        &.icon {
                            color: var(--main-blue);
                            padding: 0 8px;
                            :global(.icon) {
                                vertical-align: middle;
                            }
                        }
                        &.account {
                            flex: 1 1 auto;
                            padding: 0 2px;
                            line-height: 32px;
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
        :global(.button) {
            line-height: 1em;
        }
    }

    .login {
        margin: 0 26px;
        text-align: center;
        :global(.segment) {
            background: var(--background-highlight);
        }
        .circular-icon {
            background: var(--main-grey);
            border-radius: 50%;
            margin: 0 auto;
            position: relative;
            height: 48px;
            width: 48px;
            :global(.icon) {
                position: absolute;
                top: 12px;
                left: 12px;
                right: 12px;
                height: 24px;
                width: 24px;
            }
        }
        h3 {
            font-family: Inter;
            font-style: normal;
            font-weight: bold;
            font-size: 12px;
            line-height: 14px;
            letter-spacing: 0.01px;

            color: var(--main-black);
            margin-top: 15px;
        }
        p {
            font-family: Inter;
            font-style: normal;
            font-weight: 500;
            font-size: 10px;
            line-height: 14px;
            letter-spacing: 0.01px;

            color: #9898b5;
            margin: 7px 0 11px;
        }
    }
</style>

{#if $activeSession}
    <div class="list">
        <div class="add-account">
            <Button fluid style="primary" on:action={handleAdd}>
                <Icon name="user-plus" />
                <Text>Add another account</Text>
            </Button>
        </div>
        {#each $groupings as group}
            <div class="network">
                <div class="header" on:click={() => toggle(group.chainId)}>
                    <Text>{group.name} ({group.sessions.length})</Text>
                    <Icon name={collapsed[group.chainId] ? 'chevron-right' : 'chevron-down'} />
                </div>
                <ul class="accounts" class:collapsed={collapsed[group.chainId]}>
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
                </ul>
            </div>
        {/each}
    </div>
{:else}
    <div class="login">
        <Segment>
            <div class="circular-icon">
                <Icon size="medium" name="user-check" />
            </div>
            <h3>Supported blockchains</h3>
            <p>
                {chains
                    .filter((chain) => !chain.testnet)
                    .map((chain) => chain.name)
                    .join(', ')}
            </p>
            <ButtonLogin>Login</ButtonLogin>
        </Segment>
    </div>
{/if}
