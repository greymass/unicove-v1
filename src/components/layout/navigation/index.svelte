<script lang="ts">
    import Navbar from './navbar/index.svelte'
    import Sidebar from './navbar/sidebar/index.svelte'

    let open = false
</script>

<Sidebar bind:open />
<Navbar bind:sidebar={open} />
