<script>
    import Button from '~/components/elements/button.svelte'
    import Checkbox from '~/components/elements/checkbox.svelte'
    import Form from '~/components/elements/form.svelte'
    import Input from '~/components/elements/input.svelte'
    import InputAccount from '~/components/elements/input/account.svelte'

    const numberValidityCheck = (v: string): boolean => parseInt(v, 10) > 0

    const requireChecked = (v: boolean): boolean => v
</script>

<style lang="scss">
    div {
        margin: 16px 0;
    }
</style>

<div>
    <h2>Empty Fields</h2>
    <Form>
        <p>Enter a number greater than 0</p>
        <Input name="number" isValid={numberValidityCheck} />
        <p>Enter an account name</p>
        <InputAccount name="account" />
        <p>This button will always work:</p>
        <Button on:action={() => alert('success!')} />
        <p>The button will only enable when the form is all valid:</p>
        <Button formValidation on:action={() => alert('action!')} />
    </Form>
</div>

<div>
    <h2>Prefilled Fields</h2>
    <Form>
        <p>Enter a number greater than 0</p>
        <Input name="number" isValid={numberValidityCheck} value="1" />
        <p>Enter an account name</p>
        <InputAccount name="account" value="teamgreymass" />
        <p>The button will only enable when the form is all valid:</p>
        <Button formValidation on:action={() => alert('action!')} />
    </Form>
</div>

<div>
    <h2>Checkbox</h2>
    <Form>
        <p>Check the checkbox!</p>
        <Checkbox name="checkbox" isValid={requireChecked} label="I accept the terms!" />
        <Button formValidation on:action={() => alert('success!')} />
    </Form>
</div>
