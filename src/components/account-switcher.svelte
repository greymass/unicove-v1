<script lang="ts">
    import type {ChainId} from 'anchor-link'
    import type {SessionLike} from '../auth'
    import {sessionEquals, activate, login, logout} from '../auth'
    import {chains} from '../config'

    import {activeSession, availableSessions} from '../store'

    $: isActive = (session: SessionLike) => sessionEquals(session, $activeSession!)

    function chainName(chainId: ChainId) {
        return chains.find((c) => c.chainId === String(chainId))!.name
    }

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
    .active::after {
        content: ' ⬅ this is you';
        font-size: 0.65em;
    }
    button {
        background: black;
        color: white;
        font-size: 0.6rem;
        border: 0;
        border-radius: 50%;
        width: 1.5em;
        height: 1.5em;
        text-align: center;
        padding: 0;
        margin: 0;
        opacity: 0.15;
        cursor: pointer;
    }
    li:hover button {
        opacity: 0.5;
    }
    li button:hover {
        opacity: 1;
    }
</style>

<div>
    Accounts
    <ul>
        {#each sortedSessions as session}
            <li>
                <a
                    class:active={isActive(session)}
                    href="#select-account"
                    on:click|preventDefault={() => activate(session)}>
                    <b>{session.auth.actor}@{session.auth.permission}</b>
                    on
                    {chainName(session.chainId)}
                </a>
                <button on:click={() => logout(session)}>X</button>
            </li>
        {/each}
        <li><a on:click|preventDefault={handleAdd} href="#add-account">Add account</a></li>
    </ul>
</div>
