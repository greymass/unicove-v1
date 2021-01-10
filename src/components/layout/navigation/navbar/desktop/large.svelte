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

<div class="navbar">
    <div class="title">
        Greymass Wallet - Alpha 0.1
        <a on:click={onClose}>
            <img src={xBlueIcon} />
        </a>
    </div>
    <hr />
    <br/>
    <a href='/'>
      <div class="menu-item-container">
         <div class="menu-item {currentPath === '/' ? 'active' : ''}">
            <img src={currentPath === '/' ? dashboardGreyIcon : dashboardBlueIcon} />
              &nbsp;
            Dashboard
          </div>
      </div>
    </a>
     <a href='/transfer'>
        <div class="menu-item-container">
            <div class="menu-item {currentPath === '/transfer' ? 'active' : ''}">
               <img src={currentPath === '/transfer' ? arrowRightGreyIcon : arrowRightBlueIcon} />
                &nbsp;
               Transfer
            </div>
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
        <a href='#' class="info-icon">
            <img src={infoBlueIcon} />
            About
        </a>
     </div>
</div>

<style>
  .navbar {
    background-color: var(--main-grey);
    padding: 13px;
    width: 210px;
    height: 100%;
    border-right-width: 2px;
    align-items: center;
  }

  .navbar .title {
    font-size: 12px;
    margin-bottom: 10px;
    margin-left: 8px;
    display: inline-block;
    text-align: center;
    color: gray;
  }

   .navbar .title a {
      cursor: pointer;
   }

  .navbar .title img {
    display: inline-block;
    width: 13px;
    margin: 5px 0 -3px 10px;
  }

   .navbar a .menu-item-container .menu-item {
      border-radius: 4px;
      color: var(--main-blue);
      display: inline-block;
      margin: auto;
      padding: 15px 40px;
      min-width: 120px;
   }

    .navbar a.menu-item-link .menu-item img {
       display: inline-block;
       margin-bottom: 2px;
    }

   .navbar a .menu-item-container .active.menu-item {
      background-color: white;
      color: var(--main-black)
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
      text-decoration: none;
   }

   .navbar .bottom-container a img {
      display: inline-block;
      margin-bottom: -7px;
   }

   .navbar .bottom-container a.info-icon {
      margin-top: 20px;
   }

   .navbar .bottom-container a.info-icon img {
      margin: 20px 5px -3px 2px;
   }
</style>
