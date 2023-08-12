<script lang="ts">
    import type {Name} from '@wharfkit/antelope'
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

<Completed header="To" {changeStep}>
    <span>{toAccount}</span>
</Completed>
