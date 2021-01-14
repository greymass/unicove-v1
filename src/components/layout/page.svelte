<script lang="ts">
    import AccountSidebar from './account/sidebar.svelte'
    import Navigation from './navigation/index.svelte'
    import Footer from './footer.svelte'

    import {activeSession} from '~/store'

    import blueUserIcon from '@/images/user-blue.svg'
    import greyUserIcon from '@/images/user-grey.svg'

    /** Title of the page. */
    export let title: string

    let accountSidebar = false
</script>

<style>
    .layout {
        display: flex;
        height: 100%;
    }

    .account-button {
        position: absolute;
        right: 0;
        top: 0;
        padding: 30px;
    }

    .account-button a {
        color: var(--light-grey);
        font-size: 12px;
        cursor: pointer;
    }

    .main {
        flex-grow: 1;
        padding: 30px;
        min-height: 90vh;
    }

    .content {
        margin: 45px;
        min-height: 60vh;
    }

    .content h1 {
        margin-bottom: 20px;
    }
</style>

<section>
    <div class="layout">
        <Navigation />
        <AccountSidebar bind:open={accountSidebar} />

        <div class="account-button">
            <!-- FIXME: this should be a button component -->
            <!-- svelte-ignore a11y-missing-attribute -->
            <a on:click={() => (accountSidebar = true)}>
                <img src={accountSidebar ? greyUserIcon : blueUserIcon} />
                &nbsp;
                {$activeSession?.auth.actor}
            </a>
        </div>
        <div class="main">
            <div class="content">
                <h1>{title}</h1>
                <slot />
            </div>
            <Footer />
        </div>
    </div>
</section>
