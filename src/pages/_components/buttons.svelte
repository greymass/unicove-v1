<script>
    import Button from '~/components/elements/button.svelte'
    import Icon from '~/components/elements/icon.svelte'
    import Text from '~/components/elements/text.svelte'
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
    p {
        border-top: 1px solid black;
        font-size: 1.25em;
        font-weight: bold;
        padding: 2em;
    }
    .overunder {
        flex-direction: column;
    }
</style>

<p>Standard</p>
<div>
    <Button>Standard</Button>
    <Button style="primary">Primary</Button>
    <Button style="secondary">Secondary</Button>
    <Button>
        <Text>Icon</Text>
        <Icon name="external-link" />
    </Button>
    <Button>
        <Icon name="external-link" />
        <Text>Icon left</Text>
    </Button>
</div>

<p>Large</p>
<div>
    <Button size="large">Large</Button>
    <Button size="large" style="primary">Large Primary</Button>
    <Button size="large">
        <Icon name="unlock" />
        <Text>Icon here</Text>
    </Button>
    <Button size="large">
        <Text>Icon there</Text>
        <Icon name="external-link" />
    </Button>
    <Button size="large">
        <Icon name="bell" />
        <Text>Icon</Text>
        <Icon name="activity" />
        <Text>everywhere</Text>
        <Icon name="octagon" />
    </Button>
</div>

<p>Disabled</p>
<div>
    <Button disabled size="large">Disabled</Button>
    <Button disabled style="primary" size="large">Disabled Primary</Button>
</div>

<p>Flexbox</p>
<div class="overunder">
    <Button size="large">Flexy</Button>
    <Button size="large" style="primary">Flexy Primary</Button>
    <Button size="large" style="primary">
        <Icon name="layout" />
        <Text>Flexy with icon</Text>
    </Button>
    <Button size="large" style="primary">
        <Icon name="tool" />
        <Text>Flexing</Text>
        <Icon name="trash" />
        <Text>my</Text>
        <Icon name="layout" />
        <Text>icons</Text>
        <Icon name="twitter" />
    </Button>
</div>
