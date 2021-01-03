<script>
	import Hamburger from './small/hamburger.svelte'

	import expandIcon from '../../../../../public/images/expand.svg'
	import arrowRight from '../../../../../public/images/arrow-right.svg'

	export let sidebar = false;
	export let onExpand;
</script>

<div class="header h-full w-1/2 p-2 items-center text-gray-600 border-r-2">
    <div class="hamburger-container">
        <Hamburger bind:open={sidebar}/>
    </div>
    <hr />
    <div class="expand-icon">
        <img src={expandIcon} />
    </div>
    <a class="arrow-button" on:click={onExpand}>
        <div class="arrow-icon-container">
             <img src={arrowRight} />
        </div>
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
    margin-bottom: 30px;
    width: 25px;
  }

  .header .expand-icon img {
    width: 40px;
    margin: auto;
    margin-top: 40px;
  }

  .header a.arrow-button .arrow-icon-container {
    cursor: pointer;
    background-color: white;
    width: 60px;
    height: 50px;
    margin: auto;
    margin-top: 40px;
    padding: 15px;
    padding-top: 10px;
    border-radius: 3px;
  }

  .header a.arrow-button img {
    width: 30px;
  }
</style>
