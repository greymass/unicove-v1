<script>
	import Hamburger from './hamburger.svelte'
	import Menu from './menu.svelte'

	import expandIcon from '../../../../public/images/expand.svg'

	export let sidebar = false
</script>

<div class="header h-full w-1/2 p-2 items-center text-gray-600 border-r-2">
    <div class="hamburger-container">
        <Hamburger bind:open={sidebar}/>
    </div>
    <img class="expand-icon" src={expandIcon} />
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

  .header img.expand-icon {
    width: 40px;
    margin: auto;
    margin-top: 40px;
  }
</style>
