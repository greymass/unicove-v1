<script lang="ts">
    import type {SessionLike} from '../../../auth'
    import {sessionEquals, activate, login, logout} from '../../../auth'

    import {activeSession, availableSessions} from '../../../store'

    $: isActive = (session: SessionLike) => sessionEquals(session, $activeSession!)

    function handleAdd() {
        login().catch((error) => {
            // TODO: some sort of modal or toast for error messages like these
            console.warn('unable to add account', error)
        })
    }

    // re-sort accounts since link keeps them in last used order
    $: sortedSessions = $availableSessions.sort((a, b) => {
        return String(a.auth.actor).localeCompare(String(b.auth.actor))
    })
</script>

<style>
    .list {
        margin: 10px;
    }

    ul {
        list-style-type: none;
        padding: 10px;
    }

    button {
        background-color: transparent;
        border: none;
        color: var(--main-blue);
        font-size: 20px;
        font-weight: bold;
        margin-left: 10px;
    }
    li:hover button {
        opacity: 0.5;
    }
    li button:hover {
        opacity: 1;
    }

    li {
        padding: 15px;
        margin-top: 10px;
    }

    li a {
        color: var(--main-blue);
        margin-bottom: 10px;
        text-decoration: none;
        font-weight: normal;
    }

    li.active {
        background-color: white;
        border-radius: 3px;
    }

    li.active a {
        color: var(--light-black);
    }

    li.add-account {
        background-color: var(--light-blue);
        cursor: pointer;
        margin-top: 20px;
        text-align: center;
    }

    button:hover,
    button:active,
    button:visited,
    button:focus {
        border: none;
        outline: none;
    }

    button .dropdown-options {
        background-color: white;
        box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
        display: none;
        min-width: 100px;
        padding: 0 16px;
        position: absolute;
        right: 0;
        z-index: 1;
    }

    button .dropdown-options a {
        color: var(--main-blue);
        display: block;
        font-size: 12px;
        font-weight: normal;
        margin-top: 10px;
        margin-bottom: 10px;
    }

    button:hover .dropdown-options {
        display: block;
    }
</style>

<div class="list">
    <ul>
        {#each sortedSessions as session}
            <li class:active={isActive(session)}>
                <a href="#select-account" on:click|preventDefault={() => activate(session)}>
                    {session.auth.actor}@{session.auth.permission}
                </a>
                <button>
                    ...
                    <div class="dropdown-options">
                        <!-- svelte-ignore a11y-missing-attribute -->
                        <a on:click={() => activate(session)}> Select </a>
                        <!-- svelte-ignore a11y-missing-attribute -->
                        <a on:click={() => logout(session)}> Remove </a>
                    </div>
                </button>
            </li>
        {/each}
        <li class="add-account">
            <a on:click|preventDefault={handleAdd} href="#add-account"> Add account </a>
        </li>
    </ul>
</div>
