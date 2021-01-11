<script lang="ts">
    import {active} from 'tinro'

    import {chains, ChainFeatures} from '../../config'
    import {activeSession} from '../../store'

    $: chain = chains.find((c) => c.chainId === String($activeSession.chainId))

    $: featureEnabled = (feature: ChainFeatures): boolean => {
        return !chain || chain.chainFeatures.has(feature)
    }
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
                {#if featureEnabled(ChainFeatures.Fuel)}
                    <li><a href="/resources/fuel" use:active>Fuel</a></li>
                {/if}
                {#if featureEnabled(ChainFeatures.PowerUp)}
                    <li><a href="/resources/powerup" use:active>PowerUp</a></li>
                {/if}
                {#if featureEnabled(ChainFeatures.REX)}
                    <li><a href="/resources/rex" use:active>REX</a></li>
                {/if}
                {#if featureEnabled(ChainFeatures.Staking)}
                    <li><a href="/resources/staked" use:active>Staking</a></li>
                {/if}
            </ul>
        </li>
    </ul>
</nav>
