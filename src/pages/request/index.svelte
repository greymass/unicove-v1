<script lang="ts">
    import {onMount} from 'svelte'
    import {meta} from 'tinro'
    import type {API, TransactionHeader, PermissionLevelType} from 'anchor-link'

    import {activeSession} from '~/store'
    import Page from '~/components/layout/page.svelte'

    import {currentChain, currentRequest, currentRoute, currentTransaction} from './request'
    import {currentTemplate} from './template'

    import Default from './requests/default.svelte'
    import Loading from './requests/loading.svelte'
    import NewAccount from './requests/newaccount.svelte'

    const route = meta()
    onMount(async () => {
        currentRoute.set(route)
    })

    const templates: any = {
        loading: Loading,
        newaccount: NewAccount,
    }

    async function sign() {
        if ($activeSession) {
            const info: API.v1.GetInfoResponse = await $activeSession!.client.v1.chain.get_info()
            const header: TransactionHeader = info.getTransactionHeader()
            const abis = await $currentRequest!.fetchAbis()
            const auth: PermissionLevelType = {
                actor: $activeSession.auth.actor,
                permission: $activeSession.auth.permission,
            }
            const transaction = $currentRequest!.resolveTransaction(
                abis,
                auth,
                header
            )
            $activeSession!.transact({
                transaction,
            })
        } else if ($currentRequest) {
            window.location.href = $currentRequest.encode()
        }
    }
</script>

<style>
</style>

<Page>
    <svelte:component
        this={templates[$currentTemplate] || Default}
        chain={currentChain}
        request={currentRequest}
        session={activeSession}
        transaction={currentTransaction}
        {sign}
    />
</Page>
