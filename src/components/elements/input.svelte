<script lang="ts">
    import {onMount} from 'svelte'
    import type {inputResponse} from 'src/ui-types'

    import {createEventDispatcher} from 'svelte'

    export let disabled: boolean = false
    export let focus: boolean = false
    export let name: string = ''
    export let placeholder: string = ''
    export let value: string = ''
    let ref: HTMLInputElement

    export let isValid: any = () => true

    let timer: number | undefined
    let delay: number = 100

    onMount(() => {
        if (focus) {
            ref.focus()
        }
    })

    // Dispatched when button is activated via keyboard or click
    const dispatch = createEventDispatcher<{changed: inputResponse}>()

    const debounce = (e: Event) => {
        clearTimeout(timer)
        value = (<HTMLInputElement>e.target).value
        timer = setTimeout(
            () =>
                dispatch('changed', {
                    name,
                    valid: isValid ? isValid(value) : true,
                    value,
                }),
            delay
        )
    }

    const handleKeyup = (e: Event): void => debounce(e)
</script>

<style type="scss">
    input {
        background: #f5f6f8;
        border: 1px solid #e4e6ea;
        border-radius: 12px;
        color: #9898b5;
        font-size: 14px;
        padding: 10px 12px;
        &:focus {
            border: 1px solid #2d8eff;
            color: #585d6e;
            outline: none;
        }
    }
</style>

<input
    on:keyup={handleKeyup}
    type="text"
    {name}
    {disabled}
    {placeholder}
    bind:this={ref}
    bind:value
/>
