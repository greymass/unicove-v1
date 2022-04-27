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
    export let assumeValid: boolean = false

    let timer: number | undefined
    let delay: number = 300

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
                valid: assumeValid,
                value,
            })
        }
        dispatch('changed', {
            name,
            valid: assumeValid,
            value,
        })
    }

    type HTMLInputFormEvent = Event & {currentTarget: EventTarget & HTMLInputElement}
    const debounce = (e: HTMLInputFormEvent) => {
        clearTimeout(timer)
        value = e.currentTarget.value
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
    const handleInput = (e: HTMLInputFormEvent): void => debounce(e)
</script>

<style type="scss">
    input {
        background: var(--main-grey);
        border: 1px solid var(--dark-grey);
        border-radius: 12px;
        color: var(--main-black);
        font-size: 14px;
        padding: 10px 12px;
        &:focus {
            border: 1px solid var(--lapis-lazuli);
            color: var(--main-black);
            outline: none;
        }

        &.fullWidth {
            width: 100%;
        }
        :global(body.darkmode) & {
            background-color: #252525;
            border-color: var(--middle-green-eagle);
        }
    }
</style>

<input
    on:input={handleInput}
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
