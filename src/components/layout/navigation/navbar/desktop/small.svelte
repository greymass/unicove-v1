<script>
    import {createEventDispatcher} from 'svelte'

    import Hamburger from '../shared/hamburger.svelte'

    import dashboardIcon from '@/images/dashboard-blue.svg'
    import arrowRight from '@/images/arrow-right-grey.svg'

    const dispatch = createEventDispatcher<{expand: void}>()

    export let sidebar = false
</script>

<style>
    .navbar {
        align-items: center;
        background-color: var(--main-grey);
        border-right: 2px;
        height: 100%;
        margin: 0;
        padding-top: 30px;
        padding: 25px;
        width: 100px;
    }

    .navbar .hamburger-container {
        margin: auto;
        margin-bottom: 30px;
        width: 35px;
    }

    .navbar .dashboard-icon .dashboard-icon-container {
        display: flex;
        margin-top: 40px;
        margin-bottom: 30px;
    }

    .navbar .dashboard-icon .dashboard-icon-container img {
        width: 40px;
        margin: auto;
    }

    .navbar a.arrow-button .arrow-icon-container {
        background-color: white;
        border-radius: 3px;
        cursor: pointer;
        display: flex;
        height: 40px;
        margin-top: 60px;
        margin: auto;
        width: 70px;
        height: 50px;
    }

    .navbar a.arrow-button .arrow-icon-container img {
        width: 30px;
        margin: auto;
    }
</style>

<div class="navbar">
    <div class="hamburger-container">
        <Hamburger bind:open={sidebar} />
    </div>
    <hr />
    <a href="/" class="dashboard-icon">
        <div class="dashboard-icon-container">
            <!-- svelte-ignore a11y-missing-attribute -->
            <img src={dashboardIcon} />
        </div>
    </a>
    <!-- svelte-ignore a11y-missing-attribute -->
    <a class="arrow-button" on:click={() => dispatch('expand')}>
        <div class="arrow-icon-container">
            <!-- svelte-ignore a11y-missing-attribute -->
            <img src={arrowRight} />
        </div>
    </a>
</div>
