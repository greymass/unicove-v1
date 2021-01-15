<script>
    import Input from '~/components/input.svelte'

    let exampleOnChange = {
        valid: true,
        value: '',
    }

    let exampleIsValid = {
        valid: false,
        value: '0',
    }
</script>

<style lang="scss">
    div {
        margin: 16px 0;
    }
    .overunder {
        flex-direction: column;
    }
</style>

<div>
    <p>Default</p>
    <Input />
</div>
<div>
    <p>Autofocused</p>
    <Input focus />
</div>
<div>
    <p>Disabled</p>
    <Input disabled />
</div>
<div>
    <p>Placeholder</p>
    <Input placeholder="Testing" />
</div>
<div>
    <p>Default Value</p>
    <Input value="Default Value" />
</div>
<div>
    <p>onChange Callback</p>
    <Input onChange={(data) => (exampleOnChange = data)} />
    <p>Value: {exampleOnChange.value}</p>
    <p>Is Valid: {exampleOnChange.valid}</p>
</div>
<div>
    <p>Custom isValid Call (number > 0)</p>
    <Input
        isValid={(value) => parseInt(value, 10) > 0}
        onChange={(data) => (exampleIsValid = data)}
    />
    <p>Value: {exampleIsValid.value}</p>
    <p>Is Valid: {exampleIsValid.valid}</p>
</div>
