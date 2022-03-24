<script lang="ts">
    export let background: 'white' | 'transparent' | 'image' | 'image-alt' | '' = ''
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
        &.image {
            background-image: url('/images/dashboard-bg-1.jpg');
            background-size: 200%;
            background-position: 25% 100%;
            :global(.darkmode) & {
                background-image: url('/images/dashboard-bg-2.jpg');
            }
        }
        &.image-alt {
            background-image: url('/images/dashboard-bg-1.jpg');
            background-size: 200%;
            background-position: 0 0;
            :global(.darkmode) & {
                background-image: url('/images/dashboard-bg-2.jpg');
            }
        }
        &.bordered {
            border: 1px solid var(--divider-grey);
        }
    }
</style>

<div class="segment {background}" class:bordered>
    <slot />
</div>
