<script lang="ts">
    import {active} from 'tinro'
</script>

<style>
    nav :global(a.active)::after {
        content: ' ⬅ you are here';
        font-size: 0.65em;
    }
</style>

<nav>
    Navigation
    <ul>
        <li><a href="/" use:active exact>Dashboard</a></li>
        <li><a href="/transfer" use:active>Transfer</a></li>
    </ul>
</nav>
