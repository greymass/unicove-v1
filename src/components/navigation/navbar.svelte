<script>
	import Hamburger from './hamburger.svelte'
	import Menu from './menu.svelte'

	export let sidebar = false
</script>

<header class="flex justify-between bg-gray-200 p-2 items-center text-gray-600 border-b-2">
	<nav class="flex">
		<Hamburger bind:open={sidebar}/>
		Greymass Wallet
	</nav>

	<Menu/>
</header>
