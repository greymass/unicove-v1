<script lang="ts">
    import {createEventDispatcher} from 'svelte'
    import {fly, fade} from 'svelte/transition'

    // Props
    export let min: number = 0
    export let max: number = 100
    export let initialValue: number = 0
    export let id: any = null
    export let value: number = initialValue

    // Node Bindings
    let container: HTMLElement | null = null
    let thumb: HTMLElement | null = null
    let progressBar: HTMLElement | null = null
    let element: HTMLElement | null = null

    // Internal State
    let elementX: number = 0
    let currentThumb: HTMLElement | null = null
    let holding: boolean = false
    let thumbHover: boolean = false
    let keydownAcceleration = 0
    let accelerationTimer: NodeJS.Timeout | null = null

    // Dispatch 'change' events
    const dispatch = createEventDispatcher()

    // Mouse shield used onMouseDown to prevent any mouse events penetrating other elements,
    // ie. hover events on other elements while dragging. Especially for Safari
    const mouseEventShield = document.createElement('div')
    mouseEventShield.setAttribute('class', 'mouse-over-shield')
    mouseEventShield.addEventListener('mouseover', (e) => {
        e.preventDefault()
        e.stopPropagation()
    })

    function resizeWindow() {
        if (element) elementX = element.getBoundingClientRect().left
    }

    // Allows both bind:value and on:change for parent value retrieval
    function setValue(val: number) {
        value = val
        dispatch('change', {value})
    }

    function onTrackEvent(e: MouseEvent | TouchEvent) {
        // Update value immediately before beginning drag
        updateValueOnEvent(e)
        onDragStart(e)
    }

    function onDragStart(e: MouseEvent | TouchEvent) {
        // If mouse event add a pointer events shield
        if (e.type === 'mousedown') document.body.append(mouseEventShield)
        currentThumb = thumb
    }

    function onDragEnd(e: MouseEvent | TouchEvent) {
        // If using mouse - remove pointer event shield
        if (e.type === 'mouseup') {
            if (document.body.contains(mouseEventShield))
                document.body.removeChild(mouseEventShield)
            // Needed to check whether thumb and mouse overlap after shield removed
            if (e instanceof MouseEvent && isMouseInElement(e, thumb)) thumbHover = true
        }
        currentThumb = null
    }

    // Check if mouse event cords overlay with an element's area
    function isMouseInElement(event: MouseEvent, element: HTMLElement | null) {
        if (element === null) {
            return false
        }
        let rect = element.getBoundingClientRect()
        let {clientX: x, clientY: y} = event
        if (x < rect.left || x >= rect.right) return false
        if (y < rect.top || y >= rect.bottom) return false
        return true
    }

    // Accessible keypress handling
    function onKeyPress(e: KeyboardEvent) {
        // Max out at +/- 10 to value per event (50 events / 5)
        // 100 below is to increase the amount of events required to reach max velocity
        if (keydownAcceleration < 50) keydownAcceleration++
        let throttled = Math.ceil(keydownAcceleration / 5)

        if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
            if (value + throttled > max || value >= max) {
                setValue(max)
            } else {
                setValue(value + throttled)
            }
        }
        if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
            if (value - throttled < min || value <= min) {
                setValue(min)
            } else {
                setValue(value - throttled)
            }
        }
        // Reset acceleration after 100ms of no events
        if (accelerationTimer) clearTimeout(accelerationTimer)
        accelerationTimer = setTimeout(() => (keydownAcceleration = 1), 100)
    }

    function calculateNewValue(clientX: number) {
        // Find distance between cursor and element's left cord (20px / 2 = 10px) - Center of thumb
        let delta = clientX - (elementX + 10)

        // Use width of the container minus (5px * 2 sides) offset for percent calc
        let percent = (delta * 100) / (container!.clientWidth - 10)

        // Limit percent 0 -> 100
        percent = percent < 0 ? 0 : percent > 100 ? 100 : percent

        // Limit value min -> max
        setValue(Math.floor((percent * (max - min)) / 100) + min)
    }

    // Handles both dragging of touch/mouse as well as simple one-off click/touches
    function updateValueOnEvent(e: MouseEvent | TouchEvent) {
        // touchstart && mousedown are one-off updates, otherwise expect a currentPointer node
        if (!currentThumb && e.type !== 'touchstart' && e.type !== 'mousedown') return false

        if (e.stopPropagation) e.stopPropagation()
        if (e.preventDefault) e.preventDefault()

        // Get client's x cord either touch or mouse
        const clientX =
            e.type === 'touchmove' || (e.type === 'touchstart' && e instanceof TouchEvent)
                ? (e as TouchEvent).touches[0].clientX
                : e instanceof MouseEvent
                ? (e as MouseEvent).clientX
                : 0

        calculateNewValue(clientX)
    }

    // React to left position of element relative to window
    $: if (element) elementX = element.getBoundingClientRect().left

    // Set a class based on if dragging
    $: holding = Boolean(currentThumb)

    // Update progressbar and thumb styles to represent value
    $: if (progressBar && thumb) {
        // Limit value min -> max
        value = value > min ? value : min
        value = value < max ? value : max

        let percent = ((value - min) * 100) / (max - min)
        let offsetLeft = (container!.clientWidth - 10) * (percent / 100) + 5

        // Update thumb position + active slider track width
        thumb.style.left = `${offsetLeft}px`
        progressBar.style.width = `${offsetLeft}px`
    }
</script>

<style lang="scss">
    .slider {
        position: relative;
        flex: 1;
    }

    .slider__wrapper {
        min-width: 100%;
        position: relative;
        padding: 0.5rem;
        box-sizing: border-box;
        outline: none;
    }

    .slider__wrapper:focus-visible > .slider__track {
        box-shadow: 0 0 0 2px white, 0 0 0 3px var(--main-blue);
    }

    .slider__track {
        height: 6px;
        background-color: var(--ivory);
        border-radius: 999px;
    }

    .slider__track--highlighted {
        background-color: var(--main-blue);
        width: 0;
        height: 6px;
        position: absolute;
        border-radius: 999px;
    }

    .slider__thumb {
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        width: 20px;
        height: 20px;
        background-color: var(--main-blue);
        cursor: pointer;
        border-radius: 999px;
        margin-top: -8px;
        transition: box-shadow 100ms;
        user-select: none;
        box-shadow: var(
            --thumb-boxshadow,
            0 1px 1px 0 rgba(0, 0, 0, 0.14),
            0 0px 2px 1px rgba(0, 0, 0, 0.2)
        );
    }

    .slider__thumb::after {
        content: '';
        width: 15px;
        height: 15px;
        background-color: var(--main-blue);
        border: 2px solid var(--white, white);
        border-radius: 50%;
    }

    .slider__thumb--holding {
        box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 1px 2px 1px rgba(0, 0, 0, 0.2),
            0 0 0 6px var(--sky-blue);
    }

    .slider__tooltip {
        pointer-events: none;
        position: absolute;
        top: -33px;
        color: var(--white);
        width: 38px;
        padding: 4px 0;
        border-radius: 4px;
        text-align: center;
        background-color: var(--main-blue);
    }

    .slider__tooltip::after {
        content: '';
        display: block;
        position: absolute;
        height: 7px;
        width: 7px;
        background-color: var(--main-blue);
        bottom: -3px;
        left: calc(50% - 3px);
        clip-path: polygon(0% 0%, 100% 100%, 0% 100%);
        transform: rotate(-45deg);
        border-radius: 0 0 0 3px;
    }
</style>

<svelte:window
    on:touchmove|nonpassive={updateValueOnEvent}
    on:touchcancel={onDragEnd}
    on:touchend={onDragEnd}
    on:mousemove={updateValueOnEvent}
    on:mouseup={onDragEnd}
    on:resize={resizeWindow}
/>
<div class="slider">
    <div
        class="slider__wrapper"
        tabindex="0"
        on:keydown={onKeyPress}
        bind:this={element}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        {id}
        on:mousedown={onTrackEvent}
        on:touchstart={onTrackEvent}
    >
        <div class="slider__track" bind:this={container}>
            <div class="slider__track--highlighted" bind:this={progressBar} />
            <div
                class="slider__thumb"
                class:slider__thumb--holding={holding}
                bind:this={thumb}
                on:touchstart={onDragStart}
                on:mousedown={onDragStart}
                on:mouseover={() => (thumbHover = true)}
                on:focus={() => (thumbHover = true)}
                on:mouseout={() => (thumbHover = false)}
                on:blur={() => (thumbHover = false)}
            >
                {#if holding || thumbHover}
                    <div
                        class="slider__tooltip"
                        in:fly={{y: 7, duration: 200}}
                        out:fade={{duration: 100}}
                    >
                        {value + ' %'}
                    </div>
                {/if}
            </div>
        </div>
    </div>
</div>

<svelte:head>
    <style>
        .mouse-over-shield {
            position: fixed;
            top: 0px;
            left: 0px;
            height: 100%;
            width: 100%;
            background-color: rgba(255, 0, 0, 0);
            z-index: 10000;
            cursor: grabbing;
        }
    </style>
</svelte:head>
