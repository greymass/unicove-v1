<script lang="ts">
    import {createEventDispatcher} from 'svelte'
    /** If set button will act as a standard <a href=..tag. */
    export let href: string | undefined = undefined
    /** Whether the button is primary. */
    export let primary: boolean = false
    /** Button size. */
    export let size: 'large' | 'regular' = 'regular'

    // Dispatched when button is activated via keyboard or click
    // no need to preventDefault on the event unless the href attribute is set
    const dispatch = createEventDispatcher<{action: Event}>()

    function handleClick(event: MouseEvent) {
        if (href !== undefined) {
            event.preventDefault()
        }
        dispatch('action', event)
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.code === 'Space' || event.code === 'Enter') {
            event.preventDefault()
            dispatch('action', event)
        }
    }
</script>

<style type="scss">
    .button {
        font-size: 10px;
        display: inline-flex;
        font-weight: 700;
        letter-spacing: 0.1px;
        gap: 8px;
        justify-content: center;
        background-color: var(--light-blue);
        border-radius: 8px;
        padding: 10px 12px;
        color: var(--main-blue);
        user-select: none;
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
            border: 1px solid rgba(0, 0, 0, 0.1);
            position: relative;
            margin-right: -2px;
            margin-bottom: -2px;
            left: -1px;
            top: -1px;
        }
        &:active {
            filter: contrast(150%) brightness(105%);
        }
        &.size-large {
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
    class={`button size-${size}`}
    class:primary
    {href}
    role="button"
    tabindex="0">
    <slot>Click me</slot>
</a>
