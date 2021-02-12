<script lang="ts">
    import Modal from '~/components/elements/modal.svelte'
    import Button from '~/components/elements/Button.svelte'

    let smallModalOpened: boolean = false;
    let largeModalOpened: boolean = false;
</script>

<style lang="scss">
  div {
    padding-bottom: 20px;
  }
</style>

<div>
    <Button on:action={() => smallModalOpened = true}>
        Open Small Modal
    </Button>

    <Modal
        header="Test Header"
        size="small"
        bind:opened={smallModalOpened}
    >
        <p>
            This is where your modal body goes.
        </p>
    </Modal>

    <Button on:action={() => largeModalOpened = true}>
      Open Large Modal without header
    </Button>

    <Modal
        size="large"
        bind:opened={largeModalOpened}
    >
        <p>
            This is where your modal body goes.
        </p>
    </Modal>
</div>
