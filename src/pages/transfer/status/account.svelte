<script lang="ts">
    import type {Name} from 'anchor-link'
    import Completed from '~/pages/transfer/status/template/completed.svelte'
    import {transferData, Step} from '~/pages/transfer/transfer'

    export let toAccount: Name
</script>

<style type="scss">
    span {
        line-height: 32px;
        vertical-align: middle;
    }
</style>

<Completed
    header="Recipient"
    changeStep={() => {
        $transferData.step = Step.Recipient
    }}
>
    <span>{toAccount}</span>
</Completed>
