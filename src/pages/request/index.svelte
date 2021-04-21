<script lang="ts">
    import {onMount} from 'svelte'
    import {meta} from 'tinro'

    import {activeSession} from '~/store'
    import Page from '~/components/layout/page.svelte'

    import {
        currentChain,
        currentRequest,
        currentRoute,
        currentTemplate,
        currentTransaction,
    } from './request'

    import Default from './requests/default.svelte'
    import NewAccount from './requests/newaccount.svelte'

    const route = meta()
    onMount(async () => {
        currentRoute.set(route)
    })

    const templates: any = {
        newaccount: NewAccount,
    }

    async function sign() {
        $activeSession!.transact({
            transaction: $currentTransaction,
        })
    }
</script>

<style>
</style>

<Page>
    {#if $currentTemplate}
        <svelte:component
            this={templates[$currentTemplate] || Default}
            chain={currentChain}
            request={currentRequest}
            session={activeSession}
            transaction={currentTransaction}
            {sign}
        />
    {:else}
        Loading
    {/if}
</Page>
