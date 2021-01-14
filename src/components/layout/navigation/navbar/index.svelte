<script>
    import MediaQuery from '~/components/utils/media-query.svelte'

    import {preferences} from '~/store'

    import LargeNavbar from './desktop/large.svelte'
    import SmallNavbar from './desktop/small.svelte'
    import MobileNavbar from './mobile.svelte'

    export let sidebar = false

    $: expand = $preferences.expandNavbar
</script>

<style>
    .mobile {
        width: 0;
        z-index: 100;
    }

    .small {
        width: 15%;
    }

    .large {
        width: 22%;
    }
</style>

<MediaQuery query="(max-width: 999px)" let:matches>
    {#if matches}
        <div class="mobile">
            <MobileNavbar bind:sidebar />
        </div>
    {:else if expand}
        <div class="large">
            <LargeNavbar on:close={() => ($preferences.expandNavbar = false)} />
        </div>
    {:else}
        <div class="small">
            <SmallNavbar bind:sidebar on:expand={() => preferences.set({expandNavbar: true})} />
        </div>
    {/if}
</MediaQuery>
