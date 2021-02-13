<script lang="ts">
    import {onMount, setContext} from 'svelte'
    import {writable} from 'svelte/store'
    import type {Form, InputResponse} from '~/ui-types'

    export let requiredFields: string = [] | null

    let formFields: any = {}
    let formDisabled = writable<boolean>(true)

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
        console.log({requiredFields})
        const currentFields = Object.keys(formFields)
        const missingRequiredFields = requiredFields &&
            !requiredFields.every(requiredField => currentFields.includes(requiredField));
        console.log({missingRequiredFields})

        if (missingRequiredFields) {
           $formDisabled  = true
        } else {
           $formDisabled = Object.values(formFields).some((v) => v === false)
        }
    }
</script>

<style type="scss">
</style>

<form>
    <slot />
</form>
