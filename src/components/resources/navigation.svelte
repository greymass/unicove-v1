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
    <ul>
        <li><a href="/resources" use:active exact>Overview</a></li>
        <li><a href="/resources/fuel" use:active>Fuel</a></li>
        <li><a href="/resources/staked" use:active>Staked</a></li>
        <li><a href="/resources/rex" use:active>REX</a></li>
        <li><a href="/resources/powerup" use:active>PowerUp</a></li>
    </ul>
</nav>
