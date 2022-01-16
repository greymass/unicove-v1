<script lang="ts">
    import type {Writable} from 'svelte/store'

    import {createEventDispatcher, getContext, onMount} from 'svelte'
    import {spring} from 'svelte/motion'

    /** If set button will act as a standard <a href=..tag. */
    export let href: string | undefined = undefined
    /** Can be used in conjunction with href to set the <a target. */
    export let target: string | undefined = undefined
    /** Whether the button is default primary or secondary. */
    export let style: 'default' | 'primary' | 'secondary' | 'no-frame' | 'effect' = 'default'
    /** Button size. */
    export let size: 'large' | 'regular' = 'regular'
    /** Disabled state */
    export let disabled: boolean = false
    /** Fluid width of the button */
    export let fluid: boolean = false
    /** Should the button obey form validation */
    export let formValidation: boolean = false

    // Get parent form disabled state (if exists)
    const formDisabled: Writable<boolean> = getContext('formDisabled')

    // Dispatched when button is activated via keyboard or click
    // no need to preventDefault on the event unless the href attribute is set
    const dispatch = createEventDispatcher<{action: Event}>()

    $: isDisabled = (formValidation && $formDisabled) || disabled

    function handleClick(event: MouseEvent) {
        if (href === undefined) {
            event.preventDefault()
        }
        if (!formValidation || (!$formDisabled && !disabled)) {
            dispatch('action', event)
        }
    }

    function handleKeydown(event: KeyboardEvent) {
        if (
            !formValidation &&
            !$formDisabled &&
            !disabled &&
            (event.code === 'Space' || event.code === 'Enter')
        ) {
            event.preventDefault()
            dispatch('action', event)
        }
    }

    let hoverPos = spring(
        {x: 0, y: 0},
        {
            stiffness: 0.04,
            damping: 0.2,
        }
    )

    function handleMousemove(event: MouseEvent) {
        hoverPos.set({x: event.offsetX, y: event.offsetY})
    }

    function handleMouseenter(event: MouseEvent) {
        hoverPos.set({x: event.offsetX, y: event.offsetY}, {hard: true})
    }

    let initialGradientDeg = 90
    let gradientDeg = 90
    if (style === 'effect') {
        const duration = 1000
        const degMove = 15
        let direction: 'POS' | 'NEG' = 'POS'
        onMount(() => {
            let frame: number
            const interval = setInterval(() => {
                frame = requestAnimationFrame(() => {
                    gradientDeg = (direction === 'POS' ? gradientDeg + 1 : gradientDeg - 1) % 360
                    if (direction === 'POS' && gradientDeg >= initialGradientDeg + degMove) {
                        direction = 'NEG'
                    } else if (direction === 'NEG' && gradientDeg <= initialGradientDeg - degMove) {
                        direction = 'POS'
                    }
                })
            }, duration / degMove)

            return () => {
                cancelAnimationFrame(frame)
                clearInterval(interval)
            }
        })
    }
</script>

<style type="scss">
    .button {
        --spacing: 4px; // between items in button
        --radius: 8px; // corner radius of button
        --gradient-size: 200px; // size of hover effect

        position: relative;
        font-size: 14px;
        display: inline-flex;
        font-weight: 450;
        letter-spacing: -0.04px;
        justify-content: center;
        background-color: var(--cultured);
        border-radius: var(--radius);
        padding: 10px 12px;
        color: var(--lapis-lazuli);
        text-decoration: none;
        user-select: none;
        -webkit-user-select: none;
        cursor: pointer;
        overflow: visible;
        white-space: nowrap;
        &:focus,
        &:hover:not(.disabled) {
            outline: 0;
            border-color: rgba(0, 0, 0, 0.15);
            position: relative;
        }
        &:active:not(.disabled) {
            filter: brightness(105%);
        }
        &:focus-visible {
            outline: 0;
            text-decoration: underline;
        }
        &.primary {
            background-color: var(--lapis-lazuli);
            color: white;
            &:active:not(.disabled) {
                filter: contrast(150%) brightness(105%);
            }
            :global(body.darkmode) & {
                background-color: var(--middle-green-eagle);
                color: black;
            }
        }
        &.secondary {
            border: 1px solid #c4c4c4;
            background-color: transparent;
            color: var(--lapis-lazuli);
            font-weight: 600;
            :global(.darkmode) & {
                border-color: #3b3b3b;
                background-color: transparent;
                color: var(--middle-green-eagle);
            }
        }
        &.no-frame {
            background-color: transparent;
            border: none;
            font-weight: bold;
            :global(.darkmode) & {
                background-color: transparent;
            }
        }
        &.effect {
            background-color: var(--white);
            .before {
                position: absolute;
                border-radius: var(--radius);
                inset: -5px;
                z-index: -1;
                background: linear-gradient(
                    90deg,
                    var(--air-superiority-blue) 0%,
                    var(--light-goldenrod-yellow) 34.9%,
                    var(--sandy-brown) 67.19%,
                    var(--melon) 99.48%
                );
                filter: blur(10px);
                transition: all 200ms ease-in-out;
            }
            &:hover .before,
            &:active .before {
                inset: 5px;
                filter: blur(0px);
            }
            &:hover,
            &:active {
                border-color: var(--cultured);
            }
        }

        &.disabled {
            pointer-events: none;
            cursor: default;
            opacity: 0.3;
            cursor: not-allowed;
            pointer-events: all !important;
        }
        &.fluid {
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        &.loading {
            :global(.content .icon:not(.loading)) {
                display: none;
            }
        }
        :global(*) {
            pointer-events: none;
        }
        .hover {
            position: absolute;
            transition: 140ms ease-in-out;
            transition-property: width, left, opacity;
            top: calc(var(--gradient-size) / -2);
            left: 0px;
            border-radius: var(--radius);
            background: radial-gradient(circle closest-side, white, transparent);
            width: 0px;
            height: var(--gradient-size);
            opacity: 0.15;
            mix-blend-mode: overlay;
        }
        &:hover:not(.disabled) .hover {
            width: var(--gradient-size);
            left: calc(var(--gradient-size) / -2);
        }
        .content {
            z-index: 1;
            display: flex;
            flex-direction: row;
            align-items: center;
        }
        :global(.content > *) {
            margin-right: var(--spacing);
        }
        :global(.content > *:last-child) {
            margin-right: 0;
        }
        &.size-large {
            --spacing: 8px;
            .hover {
                --gradient-size: 500px;
            }
            border-radius: 12px;
            font-size: 16px;
            font-weight: 550;
            letter-spacing: -0.18px;
            padding: 16px 32px;
        }
        :global(body.darkmode) & {
            background-color: #252525;
            color: var(--middle-green-eagle);
        }
    }
</style>

<a
    on:click={handleClick}
    on:keydown={handleKeydown}
    on:mousemove={handleMousemove}
    on:mouseenter={handleMouseenter}
    disabled={isDisabled}
    class={`button size-${size} ${style === 'default' ? '' : style}`}
    class:disabled={isDisabled}
    class:fluid
    {href}
    {target}
    role="button"
    tabindex="0"
>
    {#if style === 'effect'}
        <span
            class="before"
            style={`background: linear-gradient(
            ${gradientDeg}deg,
            var(--air-superiority-blue) 0%,
            var(--light-goldenrod-yellow) 34.9%,
            var(--sandy-brown) 67.19%,
            var(--melon) 99.48%
        );`}
        />
    {/if}
    <!-- {#if !isDisabled}
        <span class="hover" style={`transform: translate(${$hoverPos.x}px, ${$hoverPos.y}px)`} />
    {/if} -->
    <span class="content">
        <slot>Click me</slot>
    </span>
</a>
