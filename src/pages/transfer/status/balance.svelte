<script lang="ts">
    import type {Readable} from 'svelte/store'
    import type {Balance} from '~/stores/balances'
    import type {Token} from '~/stores/tokens'

    import Button from '~/components/elements/button.svelte'
    import {Step, transferData} from '~/pages/transfer/transfer'
    import FormBalance from '~/components/elements/form/balance.svelte'

    export let token: Token
    export let balance: Readable<Balance | undefined>

    function changeToken() {
        transferData.update((data) => ({
            ...data,
            step: Step.Token,
            backStep: Step.Amount,
        }))
    }
</script>

<style type="scss">
    .control {
        margin-left: auto;
        :global(.button) {
            line-height: 24px;
        }
    }
</style>

<FormBalance {token} {balance}>
    <div class="control">
        <Button on:action={changeToken}>Change</Button>
    </div>
</FormBalance>
