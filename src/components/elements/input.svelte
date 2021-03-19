<script lang="ts">
    import {getContext, onMount} from 'svelte'
    import type {InputResponse} from 'src/ui-types'
    import type {Form} from '~/ui-types'
    import {createEventDispatcher} from 'svelte'

    export let disabled: boolean = false
    export let focus: boolean = false
    export let name: string = ''
    export let placeholder: string = ''
    export let value: string = ''

    /** Whether or not the button should go full width */
    export let fullWidth: boolean = false

    let ref: HTMLInputElement

    export let isValid: any = () => true

    let timer: number | undefined
    let delay: number = 100

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

    const debounce = (e: Event) => {
        clearTimeout(timer)
        value = (<HTMLInputElement>e.target).value
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
        background: #f5f6f8;
        border: 1px solid #e4e6ea;
        border-radius: 12px;
        color: #9898b5;
        font-size: 14px;
        padding: 10px 12px;
        &:focus {
            border: 1px solid #2d8eff;
            color: var(--light-grey);
            outline: none;
        }

        &.fullWidth {
            width: 100%;
        }
    }
</style>

<input
    on:keyup={handleKeyup}
    class={fullWidth ? 'fullWidth' : ''}
    type="text"
    {name}
    {disabled}
    {placeholder}
    bind:this={ref}
    bind:value
/>
