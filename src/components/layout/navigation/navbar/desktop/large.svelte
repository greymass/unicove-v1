<script>
	import expandIcon from '../../../../../../public/images/dashboard-blue.svg'
	import arrowRight from '../../../../../../public/images/arrow-right-grey.svg'
	import xBlueIcon from '../../../../../../public/images/x-blue.svg'

	export let sidebar = false;
	export let expand;
</script>

<div class="navbar h-full p-2 items-center text-gray-600 border-r-2">
    <div class="title">
        Greymass Wallet - Alpha 0.1

        <img src={xBlueIcon} />
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
  .navbar {
    background-color: var(--main-grey);
    padding: 13px;
    width: 210px;
  }

  .navbar .title {
    font-size: 12px;
    margin-bottom: 15px;
    display: inline-block;
    text-align: center;
  }

  .navbar .title img {
    display: inline-block;
    width: 13px;
    margin-left: 4px;
    margin-bottom: 3px;
  }

  .navbar .expand-icon img {
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
