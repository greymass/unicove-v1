<script lang="ts">
    import type {Asset} from 'anchor-link'
    import Completed from '~/pages/transfer/status/template/completed.svelte'
    import {transferData, Step} from '../transfer'

    export let quantity: Asset
</script>

<style type="scss">
    span {
        line-height: 32px;
        vertical-align: middle;
    }
</style>

<Completed
    header="Quantity"
    changeStep={() => {
        $transferData.step = Step.Amount
    }}
>
    <span>{quantity}</span>
</Completed>
