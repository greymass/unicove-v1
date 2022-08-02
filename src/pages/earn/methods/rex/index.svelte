<script>
    import type {LinkSession} from 'anchor-link'
    import type {Writable} from 'svelte/store'
    import {router} from 'tinro'

    import {currentREXBalance} from '~/stores/account'

    import REXOverview from './overview.svelte'
    import REXSetup from './setup.svelte'

    export let activeSession: Writable<LinkSession | undefined>

    let currentSession: LinkSession | undefined = $activeSession

    $: {
        if ($activeSession !== currentSession) {
            router.goto('/earn/rex')
            currentSession = $activeSession
        }
    }
</script>

<style type="scss">
</style>

{#if $currentREXBalance && $currentREXBalance.value > 0}
    <REXOverview />
{:else}
    <REXSetup />
{/if}
