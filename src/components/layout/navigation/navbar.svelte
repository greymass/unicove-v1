<script>
    import MediaQuery from '../../utils/media-query.svelte'

	import LargeNavbar from './navbar/desktop/large.svelte';
	import SmallNavbar from './navbar/desktop/small.svelte';
	import MobileNavbar from './navbar/mobile.svelte';

	export let sidebar = false;

	let expand = false;
</script>
<MediaQuery query="(max-width: 999px)" let:matches>
    {#if matches}
      <MobileNavbar bind:sidebar={sidebar} />
    {:else if expand}
      <LargeNavbar bind:expand={expand} />
    {:else}
      <SmallNavbar
        bind:sidebar={sidebar}
        bind:expand={expand}
      />
    {/if}
 </MediaQuery>
