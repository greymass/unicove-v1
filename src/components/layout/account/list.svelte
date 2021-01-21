<script lang="ts">
    import type {SessionLike} from '~/auth'
    import {sessionEquals, login, logout} from '~/auth'
    import {chainConfig} from '~/config'
    import {activeSession, availableSessions} from '~/store'

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
                padding: 0 15px;
                user-select: none;
                text-decoration: none;
                &.active {
                    background-color: white;
                    border-radius: $borderRadius;
                    color: var(--light-black);
                }
                &.add-account {
                    background-color: var(--light-blue);
                    cursor: pointer;
                    display: block;
                    font-size: 10px;
                    font-weight: 700;
                    margin-top: 20px;
                    text-align: center;
                }
                > div {
                    order: 0;
                    flex: 0 1 auto;
                    &.icon {
                        height: 32px;
                        max-height: 32px;
                        max-width: 32px;
                        overflow: hidden;
                        width: 32px;
                    }
                    &.account {
                        flex: 1 1 auto;
                        padding: 0 12px;
                    }
                    &.control {
                        text-align: center;
                        vertical-align: middle;
                        > button div.dropdown-options {
                            background-color: white;
                            box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
                            display: none;
                            min-width: 100px;
                            padding: 0 16px;
                            position: absolute;
                            right: 0;
                            z-index: 1;
                            > span {
                                color: var(--main-blue);
                                display: block;
                                font-size: 12px;
                                font-weight: normal;
                                margin-top: 10px;
                                margin-bottom: 10px;
                            }
                        }
                        &:hover button div.dropdown-options {
                            display: block;
                        }
                    }
                }
            }
        }

        button {
            background-color: transparent;
            border: none;
            color: var(--main-blue);
            font-size: 20px;
            line-height: 20px;
            vertical-align: top;
            &:hover,
            &:active,
            &:visited,
            &:focus {
                border: none;
                outline: none;
            }
        }
    }
</style>

<div class="list">
    <ul>
        {#each sessions as session}
            <li class:active={isActive(session)}>
                <div class="icon" on:click={() => onSelect(session)}>
                    {session.chain.name}
                </div>
                <div class="account" on:click={() => onSelect(session)}>
                    {session.auth.actor}
                </div>
                <div class="control">
                    <button>
                        ...
                        <div class="dropdown-options">
                            <span on:click={() => onSelect(session)}> Select </span>
                            <span on:click={() => logout(session)}> Remove </span>
                        </div>
                    </button>
                </div>
            </li>
        {/each}
        <li class="add-account" on:click|preventDefault={handleAdd} href="#add-account">
            Add account
        </li>
    </ul>
</div>
