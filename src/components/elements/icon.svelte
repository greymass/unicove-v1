<script context="module" lang="ts">
    export type IconSize = 'tiny' | 'small' | 'regular' | 'medium' | 'large' | 'huge' | 'massive'
</script>

<script lang="ts">
    import {icons} from 'feather-icons'

    export let name: string = 'help-circle'
    export let loading: boolean = false
    export let size: IconSize = 'regular'

    if (!icons[name]) {
        name = 'help-circle'
    }
</script>

<style type="scss">
    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(359deg);
        }
    }

    .icon {
        --size: 1em;

        display: inline-flex;
        width: var(--size);
        height: var(--size);

        :global(svg) {
            display: block;
            width: 100%;
            height: 100%;
        }

        &.loading {
            animation: spin 2s linear infinite;
        }

        &.tiny {
            --size: 0.5em;
        }
        &.small {
            --size: 0.75em;
        }
        &.medium {
            --size: 1.25em;
        }
        &.large {
            --size: 1.5em;
        }
        &.huge {
            --size: 2.5em;
        }
        &.massive {
            --size: 4em;
        }
    }
</style>

<span class={`icon ${size}`} class:loading>
    {@html icons[name].toSvg()}
</span>
