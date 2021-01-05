<script>
	import Hamburger from '../shared/hamburger.svelte'

	import dashboardIcon from '../../../../../../public/images/dashboard-blue.svg'
	import arrowRight from '../../../../../../public/images/arrow-right-grey.svg'

	export let sidebar = false;
	export let expand;
</script>

<div class="navbar h-full p-2 items-center text-gray-600 border-r-2">
    <div class="hamburger-container">
        <Hamburger bind:open={sidebar}/>
    </div>
    <hr />
    <a href='/' class="dashboard-icon">
        <img src={dashboardIcon} />
    </a>
    <a class="arrow-button" on:click={() => expand = true}>
        <div class="arrow-icon-container">
             <img src={arrowRight} />
        </div>
    </a>
</div>

<style>
  .navbar {
    background-color: var(--main-grey);
    padding: 25px;
    padding-top: 30px;
    width: 100px;
  }

  .navbar .hamburger-container {
    margin: auto;
    margin-bottom: 30px;
    width: 25px;
  }

  .navbar .dashboard-icon img {
    width: 40px;
    margin: auto;
    margin-top: 40px;
  }

  .navbar a.arrow-button .arrow-icon-container {
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

  .navbar a.arrow-button img {
    width: 30px;
  }
</style>
