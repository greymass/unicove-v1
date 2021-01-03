<script>
    import Menu from './menu.svelte'

	export let open = false
</script>

<aside class="absolute w-half h-full bg-gray-200 border-r-2 shadow-lg" class:open>
	<Menu />
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
