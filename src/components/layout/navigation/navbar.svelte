<script>
    import MediaQuery from '../../utils/media-query.svelte'

    import { preferences } from '../../../store';

	import LargeNavbar from './navbar/desktop/large.svelte';
	import SmallNavbar from './navbar/desktop/small.svelte';
	import MobileNavbar from './navbar/mobile.svelte';

	export let sidebar = false;

	let expand = false;

	preferences.subscribe(preferencesValue => {
        expand = preferencesValue.expandNavbar;
    });
</script>

<MediaQuery query="(max-width: 999px)" let:matches>
    {#if matches}
      <MobileNavbar bind:sidebar={sidebar} />
    {:else if expand}
      <LargeNavbar
        expand={expand}
        onClose={() => preferences.set({ expandNavbar: false }) }
      />
    {:else}
      <SmallNavbar
        bind:sidebar={sidebar}
        expand={expand}
        onExpand={() => preferences.set({ expandNavbar: true }) }
      />
    {/if}
 </MediaQuery>
