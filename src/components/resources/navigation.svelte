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
        <li>
            Resource Providers
            <ul>
                <li><a href="/resources/fuel" use:active>Fuel</a></li>
                <li><a href="/resources/staked" use:active>Staking</a></li>
                <li><a href="/resources/rex" use:active>REX</a></li>
                <li><a href="/resources/powerup" use:active>PowerUp</a></li>
            </ul>
        </li>
    </ul>
</nav>
