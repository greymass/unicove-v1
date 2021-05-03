<script lang="ts">
</script>

<style type="scss">
    .container {
        display: flex;
        min-height: 60px;
        border-bottom: 1px solid var(--divider-grey);
        &:first-child {
            border-top: 1px solid var(--divider-grey);
        }
    }
</style>

<div class="container">
    <slot />
</div>
