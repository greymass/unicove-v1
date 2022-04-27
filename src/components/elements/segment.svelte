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
            background-size: cover;
            background-image: url('/images/unicove-bright-mode-card-1.jpeg');
            :global(.darkmode) & {
                background-image: url('/images/unicove-dark-mode-card-1.jpeg');
            }
        }
        &.image-alt {
            background-size: cover;
            background-image: url('/images/unicove-bright-mode-card-2.jpeg');
            :global(.darkmode) & {
                background-image: url('/images/unicove-dark-mode-card-2.jpeg');
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
