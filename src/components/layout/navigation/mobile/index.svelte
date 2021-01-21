<script>
    import type {NavigationItem} from '~/ui-types'

    export let open = false
    export let items: NavigationItem[] = []
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
        z-index: 1001;
    }

    .open {
        left: 0;
    }

    nav {
        padding: 20px 10px;
        font-size: 16px;
        display: inline-block;
        margin: 60px;
    }
    nav a {
        display: block;
        margin: 10px;
        color: black;
        cursor: pointer;
        text-decoration: none;
    }
</style>

<aside class:open>
    <nav>
        {#each items as item}
            <a class="block" href={item.path}>{item.name}</a>
        {/each}
    </nav>
</aside>
