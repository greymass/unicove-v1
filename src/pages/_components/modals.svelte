<script lang="ts">
    import Modal from '~/components/elements/modal.svelte'
    import Button from '~/components/elements/button.svelte'

    let smallModalOpened: boolean = false
    let largeModalOpened: boolean = false
    let buttonlessModalOpened: boolean = false
</script>

<style lang="scss">
    div {
        padding-bottom: 20px;
    }
</style>

<div>
    <Modal header="Test Header" bind:opened={smallModalOpened}>
        <span slot="trigger">
            <Button on:action={() => (smallModalOpened = true)}>Open Small Modal</Button>
        </span>
        <p>This is where your modal body goes.</p>
    </Modal>

    <Modal size="large" bind:opened={largeModalOpened}>
        <span slot="trigger">
            <Button on:action={() => (largeModalOpened = true)}
                >Open Large Modal without header</Button
            >
        </span>
        <p>This is where your modal body goes.</p>
    </Modal>

    <Modal hideCloseButton bind:opened={buttonlessModalOpened}>
        <span slot="trigger">
            <Button on:action={() => (buttonlessModalOpened = true)}>
                Open Modal without close button
            </Button>
        </span>
        <p>This is where your modal body goes.</p>
    </Modal>
</div>
