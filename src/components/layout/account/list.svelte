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

    // re-sort accounts since link keeps them in last used order
    $: sessions = $availableSessions
        .sort((a: SessionLike, b: SessionLike) => {
            return String(a.auth.actor).localeCompare(String(b.auth.actor))
        })
        .map((session: any) => {
            return {
                ...session,
                chain: chainConfig(session.chainId),
            }
        })
</script>

<style type="scss">
    $borderRadius: 8px;
    .list {
        margin: 10px;
        ul {
            list-style-type: none;
            padding: 10px;
            li {
                cursor: pointer;
                color: var(--main-blue);
                display: flex;
                font-size: 13px;
                font-weight: 600;
                line-height: 33px;
                margin: 10px 0;
                user-select: none;
                text-decoration: none;
                &.active {
                    background-color: white;
                    border-radius: $borderRadius;
                    color: var(--light-black);
                    > div.icon {
                        color: var(--light-black);
                    }
                }
                &.add-account {
                    flex-direction: column;
                    line-height: 1em;
                    margin-top: 2em;
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
                        display: flex;
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
        {#each sessions as session}
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
        <li class="add-account">
            <Button primary on:action={handleAdd}>Add another Account</Button>
        </li>
    </ul>
</div>
