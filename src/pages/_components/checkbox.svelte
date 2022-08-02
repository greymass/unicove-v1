<script>
    import Checkbox from '~/components/elements/checkbox.svelte'

    let examples: any = {
        'example-on-changed': {
            value: false,
        },
    }

    const handleChange = ({detail}: {detail: any}) => {
        console.log(detail)
        examples[detail.name] = detail
    }
</script>

<style lang="scss">
    div {
        margin: 16px 0;

        &.fullWidthContainer {
            width: 500px;
        }
    }
</style>

<div>
    <p>Default</p>
    <Checkbox />
</div>
<div class="fullWidthContainer">
    <p>With Label</p>
    <Checkbox label="Check me!" />
</div>
<div>
    <p>Disabled</p>
    <Checkbox disabled />
</div>
<div>
    <p>Default Checked</p>
    <Checkbox checked />
</div>
<div>
    <p>onChange Callback</p>
    <Checkbox name="example-on-changed" on:changed={handleChange} />
    <p>Value: {examples['example-on-changed'].value}</p>
</div>
