<script lang="ts">
    import Modal from '~/components/elements/modal.svelte'
    import Button from '~/components/elements/button.svelte'

    const callbackAction = () => {
        callbackModalOpened = false
        alert('Callback Triggered!')
    }
</script>

<style lang="scss">
    div {
        padding-bottom: 20px;
    }
</style>

<div>
    <Modal header="Test Header">
        <span slot="trigger">
            <Button>Open Small Modal</Button>
        </span>
        <p>This is where your modal body goes.</p>
    </Modal>

    <Modal size="large">
        <span slot="trigger">
            <Button>Open Large Modal without header</Button>
        </span>
        <p>This is where your modal body goes.</p>
    </Modal>

    <Modal hideCloseButton>
        <span slot="trigger">
            <Button>Open Modal without close button</Button>
        </span>
        <p>This is where your modal body goes.</p>
    </Modal>

    <Modal hideCloseButton>
        <span slot="trigger">
            <Button>Open Modal with custom action</Button>
        </span>
        <p>This is where your modal body goes.</p>
        <Button on:action={callbackAction}>Click me!</Button>
    </Modal>
</div>
