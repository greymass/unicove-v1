<script lang="ts">
    import Modal from '~/components/elements/modal.svelte'
    import Button from '~/components/elements/button.svelte'

    let callbackModalDisplayed = false
    const callbackAction = () => {
        alert('Callback Triggered!')
        callbackModalDisplayed = false
    }

    let displayExternallyControlled = false
    const showExternallyControlled = () => {
        displayExternallyControlled = true
    }
</script>

<style lang="scss">
    div {
        padding-bottom: 20px;
    }
</style>

<div>
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

        <Modal hideCloseButton bind:display={callbackModalDisplayed}>
            <span slot="trigger">
                <Button>Open Modal with custom action</Button>
            </span>
            <p>This is where your modal body goes.</p>
            <Button on:action={callbackAction}>Click me!</Button>
        </Modal>
    </div>

    <div>
        <Button on:action={showExternallyControlled}>Open Externally Controlled Modal</Button>
        Opened: {displayExternallyControlled}

        <Modal header="Test Header" bind:display={displayExternallyControlled}>
            <p>This is where your modal body goes.</p>
        </Modal>
    </div>
</div>
