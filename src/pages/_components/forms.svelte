<script>
    import Button from '~/components/elements/button.svelte'
    import Form from '~/components/elements/form.svelte'
    import Input from '~/components/elements/input.svelte'
    import InputAccount from '~/components/elements/input/account.svelte'

    const numberValidityCheck = (v: string): boolean => parseInt(v, 10) > 0
</script>

<style lang="scss">
    div {
        display: flex;
        margin: 16px 0;
        margin-left: -8px;
        > :global(*) {
            margin-bottom: 8px;
            margin-left: 8px;
        }
    }
</style>

<div>
    <Form>
        <p>Enter a number greater than 0</p>
        <Input name="number" isValid={numberValidityCheck} />
        <p>Enter an account name</p>
        <InputAccount name="account" />
        <p>The button will only enable when the form is all valid:</p>
        <Button />
    </Form>
</div>
