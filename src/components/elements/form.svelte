<script lang="ts">
    import {onMount, setContext} from 'svelte'
    import {writable} from 'svelte/store'
    import type {inputResponse} from '~/ui-types'

    interface Form {
        setInput: (name: string, valid: boolean) => void
        onChange: (response: inputResponse) => void
    }

    let formFields: any = {}
    let formDisabled = writable<boolean>(true)

    const form: Form = {
        setInput: (name: string, valid: boolean = false) => {
            formFields[name] = valid
        },
        onChange: (response: inputResponse) => {
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
</script>

<style type="scss">
</style>

<form>
    <slot />
</form>
