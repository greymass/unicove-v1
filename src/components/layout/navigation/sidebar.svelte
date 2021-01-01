<script>
	export let open = false
</script>

<aside class="absolute w-half h-full bg-gray-200 border-r-2 shadow-lg" class:open>
	<nav class="px-10 py-20 text-xl">
		<a class="block" href="/">Dashboard</a>
		<a class="block" href="/transfer">Transfer</a>
	</nav>
</aside>

<style>
	aside {
		left: -100%;
		transition: left 0.3s ease-in-out
	}

	.open {
		left: 0
	}
</style>
