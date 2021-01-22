<script lang="ts">
    import {createEventDispatcher, getContext} from 'svelte'
    import {spring} from 'svelte/motion'

    import Icon from '~/components/elements/icon.svelte'

    /** If set button will act as a standard <a href=..tag. */
    export let href: string | undefined = undefined
    /** Whether the button is primary. */
    export let primary: boolean = false
    /** Button size. */
    export let size: 'large' | 'regular' = 'regular'
    /** Disabled state */
    export let disabled: boolean = false
    /** Type of button */
    export let formValidation: boolean = false
    /** Icon within the button */
    export let icon: string | undefined = undefined
    /** Icon position, left or right */
    export let iconPosition: string = 'right'

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
    $radius: 8px;
    .button {
        position: relative;
        font-size: 10px;
        display: inline-flex;
        font-weight: 700;
        letter-spacing: 0.1px;
        justify-content: center;
        background-color: var(--light-blue);
        border-radius: $radius;
        padding: 10px 12px;
        color: var(--main-blue);
        user-select: none;
        -webkit-user-select: none;
        cursor: pointer;
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
        :global(*) {
            pointer-events: none;
        }

        .hover {
            --gradient-size: 200px;
            position: absolute;
            transition: 140ms ease-in-out;
            transition-property: width, left, opacity;
            top: calc(var(--gradient-size) / -2);
            left: 0px;
            border-radius: $radius;
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
        overflow: hidden;
        .content {
            display: flex;
            flex-direction: row;
            align-items: center;
            z-index: 1;
            &.icon-left {
                flex-direction: row-reverse;
                .text {
                    margin-left: 0.625em;
                }
            }
            .text {
                margin-right: 0.625em;
            }
        }
        &.size-large {
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
    class:primary
    class:disabled={(formValidation && $formDisabled) || disabled}
    {href}
    role="button"
    tabindex="0">
    <span class="hover" style={`transform: translate(${$hoverPos.x}px, ${$hoverPos.y}px)`} />
    <span class={`content icon-${iconPosition}`}>
        <span class="text">
            <slot>Click me</slot>
        </span>
        {#if icon}
            <span class="icon">
                <Icon name={icon} />
            </span>
        {/if}
    </span>
</a>
