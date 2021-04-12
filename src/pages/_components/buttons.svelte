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
    <Button primary>Primary</Button>
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
    <Button size="large" primary>Large Primary</Button>
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
    <Button disabled primary size="large">Disabled Primary</Button>
</div>

<p>Loading</p>
<div>
    <Button loading size="large">Loading</Button>
    <Button loading primary size="large">Loading Primary</Button>
    <Button loading size="large">
        <Icon name="tool" />
        <Text>Loading with Icon</Text>
    </Button>
    <Button loading primary size="large">
        <Icon name="tool" />
        <Text>Loading Primary with Icon</Text>
    </Button>
</div>

<p>Loading false doesn't impact design</p>
<div>
    <Button loading={false} size="large">Loading</Button>
    <Button loading={false} primary size="large">Loading Primary</Button>
    <Button loading={false} size="large">
        <Icon name="tool" />
        <Text>Loading with Icon</Text>
    </Button>
    <Button loading={false} primary size="large">
        <Icon name="tool" />
        <Text>Loading Primary with Icon</Text>
    </Button>
</div>

<p>Loading while Disabled</p>
<div>
    <Button disabled loading size="large">Loading</Button>
    <Button disabled loading primary size="large">Loading Primary</Button>
    <Button disabled loading size="large">
        <Icon name="tool" />
        <Text>Loading with Icon</Text>
    </Button>
    <Button disabled loading primary size="large">
        <Icon name="tool" />
        <Text>Loading Primary with Icon</Text>
    </Button>
</div>

<p>Flexbox</p>
<div class="overunder">
    <Button size="large">Flexy</Button>
    <Button size="large" primary>Flexy Primary</Button>
    <Button size="large" primary>
        <Icon name="layout" />
        <Text>Flexy with icon</Text>
    </Button>
    <Button size="large" primary>
        <Icon name="tool" />
        <Text>Flexing</Text>
        <Icon name="trash" />
        <Text>my</Text>
        <Icon name="layout" />
        <Text>icons</Text>
        <Icon name="twitter" />
    </Button>
</div>
