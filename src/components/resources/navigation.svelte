<script lang="ts">
    import {active} from 'tinro'
    
    import {ChainFeatures} from '../../config'
    import {activeBlockchain} from '../../store'
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
                {#if $activeBlockchain.chainFeatures.has(ChainFeatures.Fuel)}
                    <li><a href="/resources/fuel" use:active>Fuel</a></li>
                {/if}
                {#if $activeBlockchain.chainFeatures.has(ChainFeatures.PowerUp)}
                    <li><a href="/resources/powerup" use:active>PowerUp</a></li>
                {/if}
                {#if $activeBlockchain.chainFeatures.has(ChainFeatures.REX)}
                    <li><a href="/resources/rex" use:active>REX</a></li>
                {/if}
                {#if $activeBlockchain.chainFeatures.has(ChainFeatures.Staking)}
                    <li><a href="/resources/staking" use:active>Staking</a></li>
                {/if}
            </ul>
        </li>
    </ul>
</nav>
