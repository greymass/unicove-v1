<script>

	import LargeNavbar from './navbar/desktop/large.svelte';
	import SmallNavbar from './navbar/desktop/small.svelte';
	import MobileNavbar from './navbar/mobile.svelte';

	export let sidebar = false;

	let expand = false;

	const isMobile = window.innerWidth < 1000;
</script>
{#if isMobile}
  <MobileNavbar bind:sidebar={sidebar} />
{:else if expand}
  <LargeNavbar />
{:else}
  <SmallNavbar
    bind:sidebar={sidebar}
    bind:expand={expand}
  />
{/if}

<style>
</style>
