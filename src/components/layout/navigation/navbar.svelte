<script>
	import Hamburger from './hamburger.svelte'
	import Menu from './menu.svelte'

	export let sidebar = false
</script>

<div class="header h-full w-1/2 p-2 items-center text-gray-600 border-r-2">
    <Hamburger bind:open={sidebar}/>
</div>

<style>
  .header {
    background-color: var(--main-grey);
    padding: 55px;
    padding-top: 30px;
  }
</style>
