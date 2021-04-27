<script lang="ts">
    import type {PublicKey} from 'anchor-link'
    import {activeBlockchain} from '~/store'
    import Completed from '~/pages/transfer/status/template/completed.svelte'

    export let toAddress: PublicKey
</script>

<style type="scss">
    span {
        line-height: 32px;
    }
</style>

<Completed header="Address">
    <span>{toAddress.toLegacyString($activeBlockchain.coreTokenSymbol.name)}</span>
</Completed>
