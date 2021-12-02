<script lang="ts">
    import {preferences, darkMode} from '~/store'
    import Icon from '~/components/elements/icon.svelte'

    function setDarkMode(state: boolean, event: MouseEvent) {
        preferences.darkmode = event.shiftKey ? null : state
    }
</script>

<style type="scss">
    .icon {
        color: var(--main-blue);
        line-height: 16px;
        margin-right: 10px;
        vertical-align: middle;
    }
</style>

{#if $darkMode}
    <span class="icon" on:click={(event) => setDarkMode(false, event)}>
        <Icon name="sun" />
    </span>
{:else}
    <span class="icon" on:click={(event) => setDarkMode(true, event)}>
        <Icon name="moon" />
    </span>
{/if}
