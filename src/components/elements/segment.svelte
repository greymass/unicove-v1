<script lang="ts">
    export let color = ''
</script>

<style type="scss">
    .segment {
        background: var(--main-grey);
        border-radius: 20px;
        color: var(--main-black);
        padding: 16px 26px;
        &.white {
            background: var(--main-white);
        }
        &.transparent {
            background: transparent;
        }
    }
</style>

<div class="segment {color}">
    <slot />
</div>
