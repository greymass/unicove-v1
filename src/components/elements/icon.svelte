<script context="module" lang="ts">
    export type IconSize = 'tiny' | 'small' | 'regular' | 'medium' | 'large' | 'huge' | 'massive'
</script>

<script lang="ts">
    import {onMount} from 'svelte'

    export let name: string = 'help-circle'
    export let spin: boolean = false
    export let size: IconSize = 'regular'

    let icons: typeof import('feather-icons').icons | undefined

    onMount(() => {
        import('feather-icons')
            .then((mod) => {
                icons = mod.icons
            })
            .catch((error) => {
                console.warn('Unable to load feather-icons', error)
            })
    })
</script>

<style type="scss">
    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

    .icon {
        --size: 16px;

        display: inline-flex;
        width: var(--size);
        height: var(--size);

        :global(svg) {
            display: block;
            width: 100%;
            height: 100%;
        }

        &.spin {
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

<span class={`icon ${size}`} class:spin>
    {#if icons}
        {@html (icons[name] || icons['help-circle']).toSvg()}
    {/if}
</span>
