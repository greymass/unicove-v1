<script>
	import Hamburger from '../shared/hamburger.svelte'

	import expandIcon from '../../../../../../public/images/dashboard-blue.svg'
	import arrowRight from '../../../../../../public/images/arrow-right-grey.svg'

	export let sidebar = false;
	export let expand;
</script>

<div class="header h-full p-2 items-center text-gray-600 border-r-2">
    <div class="hamburger-container">
        <Hamburger bind:open={sidebar}/>
    </div>
    <hr />
    <a href='/' class="expand-icon">
        <img src={expandIcon} />
    </a>
    <a class="arrow-button" on:click={() => expand = true}>
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
    width: 100px;
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
    width: 45px;
    height: 40px;
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
