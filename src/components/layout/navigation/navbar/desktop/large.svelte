<script lang="ts">
    import {router} from 'tinro'
    import {createEventDispatcher} from 'svelte'

    import dashboardBlueIcon from '@/images/dashboard-blue.svg'
    import dashboardGreyIcon from '@/images/dashboard-grey.svg'
    import arrowRightBlueIcon from '@/images/arrow-right-blue.svg'
    import arrowRightGreyIcon from '@/images/arrow-right-grey.svg'
    import xBlueIcon from '@/images/x-blue.svg'
    import messageCircleBlueIcon from '@/images/message-circle-blue.svg'
    import infoBlueIcon from '@/images/info-blue.svg'

    const dispatch = createEventDispatcher<{close: void}>()

    $: currentPath = $router.path
</script>

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
        color: var(--main-black);
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

<div class="navbar">
    <div class="title">
        Greymass Wallet - Alpha 0.1
        <!-- svelte-ignore a11y-missing-attribute -->
        <a on:click={() => dispatch('close')}>
            <!-- svelte-ignore a11y-missing-attribute -->
            <img src={xBlueIcon} />
        </a>
    </div>
    <hr />
    <br />
    <a href="/">
        <div class="menu-item-container">
            <div class="menu-item {currentPath === '/' ? 'active' : ''}">
                <!-- svelte-ignore a11y-missing-attribute -->
                <img src={currentPath === '/' ? dashboardGreyIcon : dashboardBlueIcon} />
                &nbsp; Dashboard
            </div>
        </div>
    </a>
    <a href="/transfer">
        <div class="menu-item-container">
            <div class="menu-item {currentPath === '/transfer' ? 'active' : ''}">
                <!-- svelte-ignore a11y-missing-attribute -->
                <img src={currentPath === '/transfer' ? arrowRightGreyIcon : arrowRightBlueIcon} />
                &nbsp; Transfer
            </div>
        </div>
    </a>
    <a href="/resources">
        <div class="menu-item-container">
            <div class="menu-item {currentPath === '/resources' ? 'active' : ''}">
                <!-- svelte-ignore a11y-missing-attribute -->
                <img src={currentPath === '/resources' ? arrowRightGreyIcon : arrowRightBlueIcon} />
                &nbsp; Resources
            </div>
        </div>
    </a>

    <div class="bottom-container">
        <h1>Support</h1>

        <a href="#feedback">
            <!-- svelte-ignore a11y-missing-attribute -->
            <img src={messageCircleBlueIcon} />
            Feedback
        </a>
        <br />
        <a href="#about" class="info-icon">
            <!-- svelte-ignore a11y-missing-attribute -->
            <img src={infoBlueIcon} />
            About
        </a>
    </div>
</div>
