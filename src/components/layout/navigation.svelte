<script lang="ts">
    import {active} from 'tinro'
    import Navbar from './navigation/navbar.svelte'
    import Sidebar from './navigation/sidebar.svelte'

    let open = false
</script>

<Sidebar bind:open/>
<Navbar bind:sidebar={open}/>

<style>
   :global(body) {
       padding: 0;
   }
</style>
