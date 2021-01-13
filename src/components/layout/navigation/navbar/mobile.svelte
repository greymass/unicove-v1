<script>
  import Hamburger from './shared/hamburger.svelte';

  export let sidebar = false;
</script>

<div class="hamburger-container">
    <Hamburger bind:open={sidebar}/>
</div>

<style>
 .hamburger-container {
    padding: 30px;
    width: 25px;
  }
</style>
