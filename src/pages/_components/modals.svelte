<script lang="ts">
    import Modal from '~/components/elements/modal.svelte'
    import Button from '~/components/elements/Button.svelte'

    let openModal: boolean = false;
    let openLargeModal: boolean = false;
</script>

<style lang="scss">
  div {
    padding-bottom: 20px;
  }
</style>

<div>
    <Button on:action={() => openModal = true}>
      Open Small Modal
    </Button>

    <Modal
        header="Test Header"
        size="small"
        bind:opened={openModal}
    >
        <p>
            This is where your modal body goes.
        </p>
    </Modal>

    <Button on:action={() => openLargeModal = true}>
      Open Small Modal
    </Button>

    <Modal
        size="small"
        bind:opened={openModal}
    >
        <p>
            This is where your modal body goes.
        </p>
    </Modal>
</div>
