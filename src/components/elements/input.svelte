<script lang="ts">
    import {getContext, onMount} from 'svelte'
    import type {InputResponse} from 'src/ui-types'
    import type {Form} from '~/ui-types'
    import {createEventDispatcher} from 'svelte'

    export let disabled: boolean = false
    export let focus: boolean = false
    export let inputmode: string = ''
    export let name: string = ''
    export let placeholder: string = ''
    export let value: string = ''

    /** Whether or not the button should go full width */
    export let fluid: boolean = false

    let ref: HTMLInputElement

    export let isValid: any = () => true

    let timer: number | undefined
    let delay: number = 250

    // Get parent form context (if exists)
    const form: Form = getContext('form')

    const setInitialFormValidation = async () => {
        form.setInput(name, isValid ? await isValid(value) : true)
    }

    if (form) {
        setInitialFormValidation()
    }

    onMount(() => {
        if (focus) {
            ref.focus()
        }
    })

    // Dispatched when button is activated via keyboard or click
    const dispatch = createEventDispatcher<{changed: InputResponse}>()

    function invalidate(name: string, value: any) {
        if (form) {
            form.onChange({
                name,
                valid: false,
                value,
            })
        }
        dispatch('changed', {
            name,
            valid: false,
            value,
        })
    }

    const debounce = (e: Event) => {
        clearTimeout(timer)
        value = (<HTMLInputElement>e.target).value
        // Immediately invalidate
        invalidate(name, value)
        // Debounce actual validation
        timer = setTimeout(async () => {
            const response = {
                name,
                valid: isValid ? await isValid(value) : true,
                value,
            }
            // If a form context exists, signal change events
            if (form) {
                form.onChange(response)
            }
            dispatch('changed', response)
        }, delay)
    }

    const handleKeyup = (e: Event): void => debounce(e)
</script>

<style type="scss">
    input {
        background: var(--main-white);
        border: 1px solid var(--main-blue);
        border-radius: 12px;
        color: var(--main-black);
        font-size: 14px;
        padding: 10px 12px;
        &:focus {
            border: 1px solid var(--main-blue);
            color: var(--main-black);
            outline: none;
        }

        &.fullWidth {
            width: 100%;
        }
    }
</style>

<input
    on:keyup={handleKeyup}
    class={fluid ? 'fullWidth' : ''}
    type="text"
    {name}
    {disabled}
    {inputmode}
    {placeholder}
    bind:this={ref}
    bind:value
    autocapitalize="none"
    autocorrect="off"
    autocomplete="off"
/>
