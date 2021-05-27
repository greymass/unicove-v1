<script lang="ts">
    import {activeSession} from '~/store'

    import Icon from '~/components/elements/icon.svelte'
    import MediaQuery from '~/components/utils/media-query.svelte'

    export let open = false
</script>

<style type="scss">
    .hamburger {
        cursor: pointer;
        color: var(--main-black);
        padding: 16px;
        margin: 12px 6px;
    }
</style>

<MediaQuery query="(max-width: 999px)" let:matches>
    {#if matches && $activeSession}
        <span class="hamburger" on:click={() => (open = !open)}>
            <Icon name="menu" size="large" />
        </span>
    {/if}
</MediaQuery>
