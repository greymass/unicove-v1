<script>
    import Button from '~/components/elements/button.svelte'
    import InfoIcon from '@/images/user-blue.svg'
    console.log(InfoIcon)
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
    .overunder {
        flex-direction: column;
    }
</style>

<div>
    <Button>Standard</Button>
    <Button primary>Primary</Button>
    <Button icon="external-link">Icon</Button>
    <Button icon="external-link" iconPosition="left">Icon left</Button>
</div>

<div>
    <Button size="large">Large</Button>
    <Button size="large" primary>Large Primary</Button>
    <Button size="large" icon="external-link">Large with icon</Button>
    <Button size="large" icon="external-link" iconPosition="left">Large with icon left</Button>
</div>

<div class="overunder">
    <Button size="large">Flexy</Button>
    <Button size="large" primary>Flexy Primary</Button>
    <Button size="large" primary icon="layout">Flexy with icon</Button>
    <Button size="large" primary icon="layout" iconPosition="left">Flexy with icon left</Button>
</div>
