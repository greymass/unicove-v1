<script lang="ts">
    import type {ChainId} from 'anchor-link'
    import type {SessionLike} from '../../../auth'
    import {sessionEquals, activate, login, logout} from '../../../auth'
    import {chains} from '../../../config'

    import {activeSession, availableSessions} from '../../../store'

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
    }

    li a {
        color: var(--main-blue);
        margin-bottom: 10px;
        text-decoration: none;
    }

    li.active {
       background-color: white;
       border-radius: 3px;
    }

    li.active a {
       color: var(--light-black)
    }

    .dropdown-options {
      display: none;
      position: absolute;
      background-color: #f9f9f9;
      min-width: 160px;
      box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
      padding: 12px 16px;
      z-index: 1;
    }

    button:hover .dropdown-options {
      display: block;
    }
</style>

<div class="list">
    <ul>
        {#each sortedSessions as session}
            <li class:active={isActive(session)}>
                <a
                    href="#select-account"
                    on:click|preventDefault={() => activate(session)}>
                    <b>{session.auth.actor}@{session.auth.permission}</b>
                </a>
                <button>
                   ...
                   <div class="dropdown-options">
                       <a on:click={() => activate(session)}>
                           Select
                       </a>
                       <a on:click={() => logout(session)}>
                           Remove
                       </a>
                   </div>
                </button>

            </li>
        {/each}
        <li>
            <a
                class="add-account"
                on:click|preventDefault={handleAdd}
                href="#add-account"
            >
                Add account
            </a>
        </li>
    </ul>
</div>
