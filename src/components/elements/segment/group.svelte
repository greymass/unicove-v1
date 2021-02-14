<script lang="ts">
    export let vertical: boolean = false
</script>

<style type="scss">
    .segment-group {
        display: flex;
        flex-direction: row;
        gap: 12px;
        margin: 0 0 20px;
        :global(.segment) {
            flex-grow: 1;
        }
        &.vertical {
            flex-direction: column;
        }
    }
</style>

<div class="segment-group" class:vertical>
    <slot />
</div>
