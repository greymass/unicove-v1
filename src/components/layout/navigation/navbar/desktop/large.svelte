<script>
	import dashboardBlueIcon from '../../../../../../public/images/dashboard-blue.svg'
	import dashboardGreyIcon from '../../../../../../public/images/dashboard-grey.svg'
	import arrowRightBlueIcon from '../../../../../../public/images/arrow-right-blue.svg'
	import arrowRightGreyIcon from '../../../../../../public/images/arrow-right-grey.svg'
	import xBlueIcon from '../../../../../../public/images/x-blue.svg'
	import messageCircleBlueIcon from '../../../../../../public/images/message-circle-blue.svg'
    import infoBlueIcon from '../../../../../../public/images/info-blue.svg'

	export let sidebar = false;
	export let expand;
	export let onClose;

	const currentPath = window.location.pathname;
</script>

<div class="navbar h-full p-2 items-center text-gray-600 border-r-2">
    <div class="title">
        Greymass Wallet - Alpha 0.1
        <a on:click={onClose}>
            <img src={xBlueIcon} />
        </a>
    </div>
    <hr />
    <br/>
    <a href='/' class="menu-item-link">
       <div class="menu-item {currentPath === '/' ? 'active' : ''}">
          <img src={currentPath === '/' ? dashboardGreyIcon : dashboardBlueIcon} />
          &nbsp;
          Dashboard
       </div>
    </a>
     <a href='/transfer' class="menu-item-link">
        <div class="menu-item {currentPath === '/transfer' ? 'active' : ''}">
           <img src={currentPath === '/transfer' ? arrowRightGreyIcon : arrowRightBlueIcon} />
            &nbsp;
           Transfer
        </div>
     </a>

     <div class="bottom-container">
        <h1>
            Support
        </h1>

        <a href='#'>
            <img src={messageCircleBlueIcon} />
            Feedback
        </a>
        <br />
        <a href='#'>
            <img class="info-icon" src={infoBlueIcon} />
            About
        </a>
     </div>
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

   .navbar .title a {
      cursor: pointer;
   }

  .navbar .title img {
    display: inline-block;
    width: 13px;
    margin-left: 4px;
    margin-bottom: 3px;
  }

   .navbar a.menu-item-link .menu-item {
      border-radius: 4px;
      color: var(--main-blue);
      display: inline-block;
      height: 40px;
      margin: 5px;
      padding: 10px;
      width: 160px;
   }

   .navbar a.menu-item-link .active.menu-item {
      background-color: white;
      color: var(--main-black)
   }

   .navbar a.menu-item-link .menu-item img {
      display: inline-block;
      margin-bottom: 2px;
   }

   .navbar .bottom-container {
     position: absolute;
     bottom: 0;
     left: 0;
     width: 100%;
     height: 200px;
     padding: 20px;
   }

   .navbar .bottom-container h1 {
      color: grey;
      font-size: 11px;
      margin-bottom: 15px;
      margin-top: 20px;
   }

   .navbar .bottom-container a {
      color: var(--main-blue);
      cursor: pointer;
   }

   .navbar .bottom-container a img {
      display: inline-block;
      margin: 5px
   }

   .navbar .bottom-container a img.info-icon {
      margin-right: 12px
   }
</style>
