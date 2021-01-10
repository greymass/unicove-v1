<script lang="ts">
    import {active} from 'tinro'
    import Navbar from './navigation/navbar.svelte'
    import Sidebar from './navigation/sidebar.svelte'

    let open = false
</script>

<div class="navigation">
    <Sidebar bind:open/>
    <Navbar bind:sidebar={open}/>
</div>

<style>
   .navigation {
     height: 100%;
     width: 100%;
   }

   :global(body) {
       padding: 0;
   }
</style>
