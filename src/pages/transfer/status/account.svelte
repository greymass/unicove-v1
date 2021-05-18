<script lang="ts">
    import type {Name} from 'anchor-link'
    import Completed from '~/pages/transfer/status/template/completed.svelte'
    import {transferData, Step} from '~/pages/transfer/transfer'

    export let toAccount: Name
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
        vertical-align: middle;
    }
</style>

<Completed header="Receiving Account" {changeStep}>
    <span>{toAccount}</span>
</Completed>
