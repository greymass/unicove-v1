<script lang="ts">
    import type {PublicKey} from 'anchor-link'
    import {activeBlockchain} from '~/store'
    import Completed from '~/pages/transfer/status/template/completed.svelte'
    import {Step, transferData} from '../transfer'

    export let toAddress: PublicKey

    function changeRecipient() {
        transferData.update((data) => ({
            ...data,
            step: Step.Recipient,
            backStep: data.step,
        }))
    }
</script>

<style type="scss">
    span {
        line-height: 32px;
    }
</style>

<Completed header="Recipient" changeStep={changeRecipient}>
    <span>{toAddress.toLegacyString($activeBlockchain?.coreTokenSymbol.name)}</span>
</Completed>
