<script lang="ts">
    import type {PublicKey} from 'anchor-link'
    import {activeBlockchain} from '~/store'
    import Completed from '~/pages/transfer/status/template/completed.svelte'
    import {Step, transferData} from '../transfer'

    export let toAddress: PublicKey
    export let editable: boolean = false

    function changeRecipient() {
        transferData.update((data) => ({
            ...data,
            step: Step.Recipient,
            backStep: data.step,
        }))
    }

    const changeStep = editable ? changeRecipient : undefined
</script>

<style type="scss">
    span {
        line-height: 32px;
    }
</style>

<Completed header="Receiving Address" {changeStep}>
    <span>{toAddress.toLegacyString($activeBlockchain?.coreTokenSymbol.name)}</span>
</Completed>
