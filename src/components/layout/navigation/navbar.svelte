<script>

	import LargeNavbar from './navbar/large.svelte';
	import SmallNavbar from './navbar/small.svelte'

	export let sidebar = false;

	let expand = false;
</script>

{#if expand}
  <LargeNavbar />
{:else}
  <SmallNavbar sidebar={sidebar} onExpand={() => expand = true}/>
{/if}

<style>
</style>
