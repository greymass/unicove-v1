<script lang="ts">
    import {createEventDispatcher, getContext} from 'svelte'
    import {spring} from 'svelte/motion'

    /** If set button will act as a standard <a href=..tag. */
    export let href: string | undefined = undefined
    /** Whether the button is primary. */
    export let primary: boolean = false
    /** Button size. */
    export let size: 'large' | 'regular' = 'regular'
    /** Disabled state */
    export let disabled: boolean = false
    /** Fluid width of the button */
    export let fluid: boolean = false
    /** Type of button */
    export let formValidation: boolean = false

    // Get parent form disabled state (if exists)
    const formDisabled: SvelteStore<boolean> = getContext('formDisabled')

    // Dispatched when button is activated via keyboard or click
    // no need to preventDefault on the event unless the href attribute is set
    const dispatch = createEventDispatcher<{action: Event}>()

    function handleClick(event: MouseEvent) {
        if (href !== undefined) {
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
</script>

<style type="scss">
    .button {
        --spacing: 4px; // between items in button
        --radius: 8px; // corner radius of button
        --gradient-size: 200px; // size of hover effect

        position: relative;
        font-size: 10px;
        display: inline-flex;
        font-weight: 700;
        letter-spacing: 0.1px;
        justify-content: center;
        background-color: var(--light-blue);
        border-radius: var(--radius);
        padding: 10px 12px;
        color: var(--main-blue);
        text-decoration: none;
        user-select: none;
        -webkit-user-select: none;
        cursor: pointer;
        overflow: hidden;
        white-space: nowrap;

        &.primary {
            background-color: var(--main-blue);
            color: white;
        }
        &:focus-visible {
            outline: 0;
            text-decoration: underline;
        }
        &:focus,
        &:hover {
            outline: 0;
            border-color: rgba(0, 0, 0, 0.15);
            position: relative;
        }
        &:active {
            filter: contrast(150%) brightness(105%);
        }
        &.disabled {
            background-color: var(--light-red);
            border-color: var(--main-red);
            color: var(--main-red);
            pointer-events: none;
            cursor: default;
            opacity: 0.5;
            cursor: not-allowed;
            pointer-events: all !important;
        }
        &.fluid {
            display: flex;
            flex-direction: column;
            margin: 20px 0;
            align-items: center;
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
            opacity: 0.45;
            mix-blend-mode: overlay;
        }
        &:hover .hover {
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
            font-size: 16px;
            font-weight: 600;
            letter-spacing: -0.18px;
            padding: 16px 32px;
        }
    }
</style>

<a
    on:click={handleClick}
    on:keydown={handleKeydown}
    on:mousemove={handleMousemove}
    on:mouseenter={handleMouseenter}
    class={`button size-${size}`}
    class:disabled={(formValidation && $formDisabled) || disabled}
    class:fluid
    class:primary
    {href}
    role="button"
    tabindex="0"
>
    <span class="hover" style={`transform: translate(${$hoverPos.x}px, ${$hoverPos.y}px)`} />
    <span class="content">
        <slot>Click me</slot>
    </span>
</a>
