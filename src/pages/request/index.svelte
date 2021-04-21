<script lang="ts">
    import {onMount} from 'svelte'
    import {meta} from 'tinro'
    import type {Transaction} from '@greymass/eosio'

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

    onMount(() => currentRoute.set(meta()))

    const templates: any = {
        newaccount: NewAccount,
    }

    async function sign() {
        if (!$currentTransaction) return
        const transaction: Transaction = await $currentTransaction
        if ($currentTransaction) {
            $activeSession!.transact({
                transaction,
            })
        }
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
