<script lang="ts">
    export let color = ''
</script>

<style type="scss">
    :global(.darkmode) .segment {
        background: var(--darkmode-dark-grey);
        color: var(--darkmode-blue);
    }
    .segment {
        background: #f7f7fc;
        border-radius: 20px;
        padding: 16px 26px;
        &.white {
            background: var(--main-white);
        }
    }
</style>

<div class="segment {color}">
    <slot />
</div>
