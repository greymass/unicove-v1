<script lang="ts">
    export let color = ''
    export let bordered = false
</script>

<style type="scss">
    .segment {
        background: var(--main-grey);
        border-radius: 20px;
        color: var(--main-black);
        padding: 22px 26px;
        &.white {
            background: var(--main-white);
        }
        &.bordered {
            border: 1px solid var(--divider-grey);
        }
        &.transparent {
            background: transparent;
        }
    }
</style>

<div class="segment {color}" class:bordered>
    <slot />
</div>
