<script>
    import Menu from './menu.svelte'

    export let open = false
</script>

<style>
    aside {
        top: 0;
        left: -100%;
        transition: left 0.3s ease-in-out;
        position: absolute;
        width: 50%;
        max-width: 250px;
        height: 100%;
        background-color: var(--main-grey);
        border-right-width: 2px;
        border-color: darkgray;
    }

    .open {
        left: 0;
    }
</style>

<aside class:open>
    <Menu />
</aside>
