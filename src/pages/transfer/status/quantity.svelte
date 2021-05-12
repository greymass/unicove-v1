<script lang="ts">
    import type {Asset} from 'anchor-link'
    import Completed from '~/pages/transfer/status/template/completed.svelte'
    import {transferData, Step} from '../transfer'

    export let quantity: Asset

    function changeAmount() {
        transferData.update((data) => ({
            ...data,
            step: Step.Amount,
            backStep: data.step,
        }))
    }
</script>

<style type="scss">
    span {
        line-height: 32px;
        vertical-align: middle;
    }
</style>

<Completed header="Quantity" changeStep={changeAmount}>
    <span>{quantity}</span>
</Completed>
