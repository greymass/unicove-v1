<script lang="ts">
    import Button from '~/components/elements/button.svelte'
    import Form from '~/components/elements/form.svelte'
    import Input from '~/components/elements/input.svelte'

    import {transferData, Step} from '~/pages/transfer/transfer'

    let memo: string = String($transferData.memo || '')

    function confirmChange() {
        transferData.update((data) => ({
            ...data,
            memo,
            step: data.backStep || Step.Confirm,
            backStep: undefined,
        }))
    }
</script>

<style type="scss">
</style>

<div class="container">
    <Form on:submit={confirmChange}>
        <Input
            name="memo"
            focus
            fluid
            bind:value={memo}
            placeholder="Enter an optional memo to include with this transfer"
        />
        <Button primary size="large" fluid formValidation on:action={confirmChange}>
            {#if memo}
                Set Memo
            {:else}
                Continue without Memo
            {/if}
        </Button>
    </Form>
</div>
