<script lang="ts">
    import type {Form, InputResponse} from '~/ui-types'
    import type {Writable} from 'svelte/store'

    import {createEventDispatcher, onMount, setContext} from 'svelte'
    import {writable} from 'svelte/store'

    const dispatch = createEventDispatcher<{submit: HTMLFormElement}>()

    let formFields: any = {}
    let formDisabled: Writable<boolean> = writable<boolean>(true)

    const form: Form = {
        setInput: (name: string, valid: boolean = false) => {
            formFields[name] = valid
            validate()
        },
        onChange: (response: InputResponse) => {
            formFields[response.name] = response.valid
            validate()
        },
    }

    setContext('form', form)
    setContext('formDisabled', formDisabled)

    onMount(validate)

    function validate() {
        $formDisabled = Object.values(formFields).some((v) => v === false)
    }

    function submit(event: any) {
        if (!$formDisabled) {
            dispatch('submit', event)
        }
    }
</script>

<style type="scss">
</style>

<form on:submit|preventDefault={submit}>
    <slot />
</form>
