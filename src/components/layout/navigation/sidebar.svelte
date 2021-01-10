<script>
    import Menu from './menu.svelte'

	export let open = false
</script>

<aside class:open>
	<Menu />
</aside>

<style>
	aside {
		left: -100%;
		transition: left 0.3s ease-in-out;
		position: absolute;
		width: 50%;
		height: 100%;
		--tw-bg-opacity: 1;
        background-color: rgba(229, 231, 235, var(--tw-bg-opacity));
        border-right-width: 2px;
        --tw-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
	}

	.open {
		left: 0
	}
</style>
