<script lang="ts">
    export let vertical: boolean = false
</script>

<style type="scss">
    .segment-group {
        --gap: 12px;
        display: inline-flex;
        flex-wrap: wrap;
        margin: calc(-1 * var(--gap)) 0 0 calc(-1 * var(--gap));
        width: calc(100% + var(--gap));
        :global(> *) {
            margin: var(--gap) 0 0 var(--gap);
        }
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
