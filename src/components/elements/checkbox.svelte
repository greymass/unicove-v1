<script lang="ts">
    import {getContext} from 'svelte'
    import type {InputResponse} from 'src/ui-types'
    import type {Form} from '~/ui-types'
    import {createEventDispatcher} from 'svelte'

    export let disabled: boolean = false
    export let name: string = ''
    export let label: string = ''
    export let checked: boolean = false

    let ref: HTMLInputElement

    export let isValid: any = () => true
    export let assumeValid: boolean = false

    // Get parent form context (if exists)
    const form: Form = getContext('form')

    const setInitialFormValidation = async () => {
        form.setInput(name, isValid ? await isValid(checked) : true)
    }

    if (form) {
        setInitialFormValidation()
    }

    // Dispatched when button is activated via keyboard or click
    const dispatch = createEventDispatcher<{changed: InputResponse}>()

    type HTMLInputFormEvent = Event & {currentTarget: EventTarget & HTMLInputElement}
    const handleToggle = (event: HTMLInputFormEvent): void => {
        let response: InputResponse
        checked = event.currentTarget.checked
        response = {
            name,
            valid: isValid ? isValid(checked) : true,
            value: checked,
        }
        if (form) {
            form.onChange(response)
        }
        dispatch('changed', response)
    }
</script>

<style type="scss">
    .container {
        font-size: 1.5rem;
        line-height: 2rem;
        display: grid;
        grid-template-columns: 1em auto;
        gap: 0.85em;
        user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        -webkit-touch-callout: none;
        -o-user-select: none;
        -moz-user-select: none;
        cursor: pointer;
        input[type='checkbox'] {
            -webkit-appearance: none;
            appearance: none;
            background-color: var(--form-background);
            margin: 0;
            transform: translateY(-0.075em);
            display: grid;
            place-content: center;
        }
        input[type='checkbox']::before {
            content: '';
            height: 24px;
            width: 24px;
            background: var(--main-grey);
            border: 1px solid var(--dark-grey);
            border-radius: 8px;
        }
        input[type='checkbox']:checked::before {
            border: none;
            background: var(--lapis-lazuli);
            background-image: url("data:image/svg+xml,%3Csvg width='12' height='9' viewBox='0 0 12 9' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 1L4.125 8L1 4.81818' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E%0A");
            background-repeat: no-repeat;
            background-attachment: fixed;
            background-position: center;
        }

        input[type='checkbox']:disabled::before {
            --form-control-color: var(--form-control-disabled);
            color: var(--form-control-disabled);
            cursor: not-allowed;
            background: var(--main-grey);
            border: 1px solid var(--main-grey);
        }
    }
</style>

<label class="container">
    <input
        type="checkbox"
        on:change={handleToggle}
        {name}
        {disabled}
        bind:this={ref}
        bind:checked
    />
    {label}
</label>
