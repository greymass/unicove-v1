<script lang="ts">
    export let background: 'white' | 'transparent' | 'image-1' | 'image-2' | '' = ''
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
        &.transparent {
            background: transparent;
        }
        &.image-1 {
            background: url('/images/dashboard-bg-1.jpeg') no-repeat;
            background-size: cover;
        }
        &.image-2 {
            background: url('/images/dashboard-bg-2.jpeg') no-repeat;
            background-size: cover;
        }
        &.bordered {
            border: 1px solid var(--divider-grey);
        }
    }
</style>

<div class="segment {background}" class:bordered>
    <slot />
</div>
