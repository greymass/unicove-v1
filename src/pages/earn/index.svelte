<script lang="ts">
    import type {Readable} from 'svelte/store'

    import {Route} from 'tinro'
    import {derived} from 'svelte/store'

    import {earnMethods} from '~/config'
    import {activeBlockchain, activeSession} from '~/store'
    import {balances} from '~/stores/balances'

    import Page from '~/components/layout/page.svelte'
    import Button from '~/components/elements/button.svelte'

    import EarnREX from '~/pages/earn/methods/rex/index.svelte'
    import EarnDebug from '~/pages/earn/methods/debug/index.svelte'

    const enabled: Readable<boolean> = derived(activeBlockchain, ($activeBlockchain) => {
        if ($activeBlockchain) {
            return Array.from($activeBlockchain.earnMethods).some((r) => earnMethods.includes(r))
        }
        return false
    })
</script>

{#if $activeBlockchain}
    <Page>
        {#if $enabled}
            <Route path="/">
                <EarnREX {activeSession} />
            </Route>
            <Route path="/debug">
                <EarnDebug {activeBlockchain} {activeSession} {balances} />
            </Route>
            <Route path="/rex/*">
                <EarnREX {activeSession} />
            </Route>
        {:else}
            <p>
                The Earn section of Unicove is not available on the {$activeBlockchain.name} blockchain.
            </p>
            <Button href="/">Back to Dashboard</Button>
        {/if}
    </Page>
{/if}
