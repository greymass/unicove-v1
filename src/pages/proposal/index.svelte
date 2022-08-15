<script lang="ts">
    import {derived, Readable} from 'svelte/store'
    import type {TinroRouteMeta} from 'tinro'
    import {Bytes, Name, PackedTransaction, Serializer, Transaction} from '@greymass/eosio'

    import {activeSession} from '~/store'

    import Page from '~/components/layout/page.svelte'
    import {getClient} from '~/api-client'
    import {chainConfig, getChainId} from '~/config'
    import {getProposal} from './proposal'
    import {onMount} from 'svelte'

    export let meta: TinroRouteMeta | undefined = undefined

    let transaction: any = undefined

    onMount(async () => {
        if (meta) {
            const {params} = meta
            const chain = getChainId(params.network)
            const config = chainConfig(chain)
            const client = getClient(config)
            transaction = await getProposal(client, params.account, params.proposal)
        }
    })
</script>

<style type="scss">
</style>

<Page>
    <p>Proposal Data</p>
    <pre>
{transaction ? JSON.stringify(transaction, null, '\t') : 'Loading...'}
    </pre>
</Page>
