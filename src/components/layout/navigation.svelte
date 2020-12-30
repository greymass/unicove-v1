<script lang="ts">
    import {active} from 'tinro'
    import Navbar from './navigation/navbar.svelte'
    import Sidebar from './navigation/sidebar.svelte'

    let open = false
</script>

<style>
    nav :global(a.active)::after {
        content: ' ⬅ you are here';
        font-size: 0.65em;
    }

    :global(body) {
        padding: 0;
    }
</style>
<nav>
    <Sidebar bind:open/>
    <Navbar bind:sidebar={open}/>
</nav>
