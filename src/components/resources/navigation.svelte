<script lang="ts">
    import {active} from 'tinro'

    import {chains, featureEnabled, ChainFeatures} from '../../config'
    import {activeSession} from '../../store'
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
                {#if featureEnabled($activeSession, ChainFeatures.Fuel)}
                    <li><a href="/resources/fuel" use:active>Fuel</a></li>
                {/if}
                {#if featureEnabled($activeSession, ChainFeatures.PowerUp)}
                    <li><a href="/resources/powerup" use:active>PowerUp</a></li>
                {/if}
                {#if featureEnabled($activeSession, ChainFeatures.REX)}
                    <li><a href="/resources/rex" use:active>REX</a></li>
                {/if}
                {#if featureEnabled($activeSession, ChainFeatures.Staking)}
                    <li><a href="/resources/staked" use:active>Staking</a></li>
                {/if}
            </ul>
        </li>
    </ul>
</nav>
