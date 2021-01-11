<script>
    import Menu from './navbar/sidebar/list.svelte'

	export let open = false
</script>

<aside class:open>
	<List />
</aside>

<style>
	aside {
	    top: 0;
		right: -100%;
		transition: left 0.3s ease-in-out;
		position: absolute;
		width: 50%;
		max-width: 250px;
		height: 100%;
        background-color: rgba(229, 231, 235);
        border-right-width: 2px;
        border-color: darkgray;
	}

	.open {
	   left: 0
	}
</style>

