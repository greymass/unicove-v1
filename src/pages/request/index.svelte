<script lang="ts">
    import {meta} from 'tinro'
    import {onMount} from 'svelte'
    import type {SigningRequest} from 'eosio-signing-request'

    import {request} from './request'
    import Page from '~/components/layout/page.svelte'

    import Segment from '~/components/elements/segment.svelte'

    const route = meta()
    console.log(route)

    let esr: SigningRequest
    onMount(async () => {
        esr = await request(route.params)
    })
</script>

<style>
</style>

<Page title="Signing Request">
    {#if esr}
        <code>
            <pre>{JSON.stringify(esr.data, null, 4)}</pre>
        </code>
    {/if}
    <Segment>Test</Segment>
</Page>
