<script lang="ts">
    import {active, meta} from 'tinro'
    import {onMount} from 'svelte'
    import type {SigningRequest} from 'eosio-signing-request'

    import {activeBlockchain, activeSession, currentAccount} from '~/store'
    import {chainConfig} from '~/config'
    import {getRequest} from './request'

    import Page from '~/components/layout/page.svelte'

    import Button from '~/components/elements/button.svelte'
    import Segment from '~/components/elements/segment.svelte'
    import {getClient} from '~/api-client'
    import type {API, TransactionHeader} from '@greymass/eosio'

    const client = getClient($activeSession!.chainId)
    const route = meta()

    let abis: any
    let chain: any
    let chains: any[]
    let multichain = false
    let transaction: any

    onMount(async () => {
        await processRequest($activeSession!)
    })

    async function processRequest(session: any) {
        esr = await getRequest(route.params)
        abis = await esr.fetchAbis()
        multichain = esr.isMultiChain()
        if (multichain) {
            chains = esr.getChainIds()
            const ids = JSON.parse(JSON.stringify(chains))
            console.log(ids)
            console.log(ids[0])
            if (session && ids.includes(String(session.chainId))) {
                console.log(session.chainId)
                chain = chainConfig(String(session.chainId))
            } else {
                chain = chainConfig(ids[0])
            }
        } else {
            chain = chainConfig(esr.getChainId())
            chains = []
        }
        const info: API.v1.GetInfoResponse = await $activeSession!.client.v1.chain.get_info()
        const header: TransactionHeader = info.getTransactionHeader()
        transaction = esr.resolveTransaction(abis, $activeSession!.auth, header)
        return esr
    }

    $: esr = processRequest($activeSession!)

    async function sign() {
        const info: API.v1.GetInfoResponse = await $activeSession!.client.v1.chain.get_info()
        const header: TransactionHeader = info.getTransactionHeader()
        $activeSession!.transact({
            transaction: esr.resolveTransaction(abis, $activeSession!.auth, header),
        })
    }
</script>

<style>
</style>

<Page title="Signing Request">
    {#if esr && chain}
        <Button on:action={sign}>Sign Transaction</Button>
        {chain.name}
        <code>
            <pre>{JSON.stringify(transaction, null, 4)}</pre>
        </code>
        <code>
            <pre>{JSON.stringify(esr.data, null, 4)}</pre>
        </code>
    {/if}
    <Segment>Test</Segment>
</Page>
