<script>
    import {activeSession} from '~/store'
    import Icon from '~/components/elements/icon.svelte'
    import ThemeButton from '~/components/elements/button/mode.svelte'

    export let open = false
</script>

<style type="scss">
    .account-button {
        display: flex;
        align-items: center;
        color: var(--main-blue);
        cursor: pointer;
        font-size: 14px;
        font-weight: 600;
        margin: 0 6px 0 auto;
        .icon {
            color: var(--main-blue);
            line-height: 16px;
            margin-right: 10px;
            vertical-align: middle;
        }
    }
    .accounts {
        display: flex;
        align-items: center;
    }
    @media only screen and (max-width: 600px) {
        .account-button .accounts {
            .icon {
                margin-right: 0;
            }
            .text {
                display: none;
            }
        }
    }
</style>

<div class="account-button">
    <ThemeButton />
    <span class="accounts" on:click={() => (open = true)}>
        <span class="icon">
            <Icon name="user" />
        </span>
        <span class="text">
            {#if $activeSession}
                {$activeSession?.auth.actor}
            {:else}
                Login
            {/if}
        </span>
    </span>
</div>
