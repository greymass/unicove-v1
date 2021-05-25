<style lang="scss" global>
    // Styles are global since we also depend on them _before_ the app has loaded.
    // The app-loading div is also present in the static html served to initialize the app.
    .app-loading {
        --size: 60px;
        position: fixed;
        top: calc(50% - var(--size) / 2);
        left: calc(50vw - var(--size) / 2);
        border-top: 3px solid var(--main-blue);
        border-right: 0;
        animation: app-loading-spin 1.618s linear infinite;
        height: var(--size);
        width: var(--size);
        background: var(--main-white);
        border-radius: 50%;
    }
    @keyframes app-loading-spin {
        to {
            transform: rotate(360deg);
        }
    }
</style>

<div class="app-loading" />
