<script>
	import Hamburger from './navbar/hamburger.svelte'

	import expandIcon from '../../../../public/images/expand.svg'

	export let sidebar = false

	let expand = false;
</script>

<div class="header h-full w-1/2 p-2 items-center text-gray-600 border-r-2">
    <div class="hamburger-container">
        <Hamburger bind:open={sidebar}/>
    </div>
    <a class="expand-icon" on:click={() => expand = !expand}>
        <img src={expandIcon} />
    </a>
</div>

<style>
  .header {
    background-color: var(--main-grey);
    padding: 25px;
    padding-top: 30px;
  }

  .header .hamburger-container {
    margin: auto;
    width: 25px;
  }

  .header a.expand-icon {
    cursor: pointer;
  }

  .header a.expand-icon img {
    width: 40px;
    margin: auto;
    margin-top: 40px;
  }
</style>
