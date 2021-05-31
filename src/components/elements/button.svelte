<script lang="ts">
    import type {Writable} from 'svelte/store'

    import {createEventDispatcher, getContext} from 'svelte'
    import {spring} from 'svelte/motion'
    import {writable} from 'svelte/store'

    import Icon from '~/components/elements/icon.svelte'
    import Text from '~/components/elements/text.svelte'

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
    /** Should the button obey form validation */
    export let formValidation: boolean = false
    /** Is the button in a loading state? */
    export let loading: Writable<boolean> = writable<boolean>(false)

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
        if (!isDisabled) {
            hoverPos.set({x: event.offsetX, y: event.offsetY})
        }
    }

    function handleMouseenter(event: MouseEvent) {
        if (!isDisabled) {
            hoverPos.set({x: event.offsetX, y: event.offsetY}, {hard: true})
        }
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
            &:active:not(.disabled) {
                filter: contrast(150%) brightness(105%);
            }
        }
        &:focus-visible {
            outline: 0;
            text-decoration: underline;
        }
        &:focus,
        &:hover:not(.disabled) {
            outline: 0;
            border-color: rgba(0, 0, 0, 0.15);
            position: relative;
        }
        &:active:not(.disabled) {
            filter: brightness(105%);
        }
        &.disabled {
            color: var(--always-white);
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
            opacity: 0.45;
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
    disabled={isDisabled}
    class={`button size-${size}`}
    class:disabled={isDisabled}
    class:$loading
    class:fluid
    class:primary
    {href}
    role="button"
    tabindex="0"
>
    <span class="hover" style={`transform: translate(${$hoverPos.x}px, ${$hoverPos.y}px)`} />
    <span class="content">
        {#if $loading}
            <Icon loading name="life-buoy" />
            <Text><slot>Click me</slot></Text>
        {:else}
            <slot>Click me</slot>
        {/if}
    </span>
</a>
