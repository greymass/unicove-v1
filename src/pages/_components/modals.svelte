<script lang="ts">
    import {writable} from 'svelte/store'

    import Modal from '~/components/elements/modal.svelte'
    import ModalTrigger from '~/components/elements/modal/trigger.svelte'
    import Button from '~/components/elements/button.svelte'

    const customAction = (callback: any) => {
        alert('Callback Triggered!')
        callback()
    }

    let displayExternallyControlled = writable<boolean>(false)
    const showExternallyControlled = () => {
        $displayExternallyControlled = true
    }

    let displaySmallModal = writable<boolean>(false)
</script>

<style lang="scss">
    div,
    h2 {
        padding-bottom: 20px;
    }
</style>

<div>
    <div>
        <div>
            <h2>Independent Modals</h2>
            <div>
                <Button on:action={() => ($displaySmallModal = true)}>Open Small Modal</Button>

                {#if $displaySmallModal}
                    <Modal size="small" display={displaySmallModal}>
                        <p>This is where your modal body goes.</p>
                    </Modal>
                {/if}
            </div>
            <div>
                <Button on:action={showExternallyControlled}
                    >Open Externally Controlled Modal</Button
                >
                Opened: {$displayExternallyControlled}

                <Modal header="Test Header" bind:display={displayExternallyControlled}>
                    <p>This is where your modal body goes.</p>
                </Modal>
            </div>
        </div>

        <div>
            <h2>Modals wrapped in Triggers</h2>

            <ModalTrigger let:display content="Basic">
                <Modal {display}>
                    <p>This was from a ModalTrigger.</p>
                </Modal>
            </ModalTrigger>

            <ModalTrigger let:display content="With a header">
                <Modal header="A different test header" {display}>
                    <p>This is where your modal body goes.</p>
                </Modal>
            </ModalTrigger>

            <ModalTrigger let:display content="Large!">
                <Modal size="large" {display}>
                    <p>This is where your modal body goes.</p>
                </Modal>
            </ModalTrigger>

            <ModalTrigger let:display content="No close button">
                <Modal hideCloseButton {display}>
                    <p>This is where your modal body goes.</p>
                </Modal>
            </ModalTrigger>

            <ModalTrigger let:display content="No dimmer close">
                <Modal disableDimmerClose {display}>
                    <p>This is where your modal body goes.</p>
                </Modal>
            </ModalTrigger>

            <ModalTrigger let:display content="Disabled" disabled>
                <Modal disableDimmerClose {display}>
                    <p>This is where your modal body goes.</p>
                </Modal>
            </ModalTrigger>

            <ModalTrigger let:display let:close content="Close when performing custom action">
                <Modal disableDimmerClose hideCloseButton {display}>
                    <p>This is where your modal body goes.</p>
                    <Button on:action={() => customAction(close)}>Callback & Close!</Button>
                </Modal>
            </ModalTrigger>
        </div>
    </div>
</div>
