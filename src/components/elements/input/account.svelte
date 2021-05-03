<script lang="ts">
    import InputLabelled from '~/components/elements/input/labelled.svelte'

    import {validatePresence} from './validators/presence'
    import {validateAccountLength} from './validators/account'

    // Generic input type matching
    export let name: string = ''
    export let fluid: boolean = false
    export let focus: boolean = false
    export let inputmode: string = ''
    export let placeholder: string | undefined = undefined
    export let value: string = ''

    export let errorMessage: string | undefined = undefined
    export let isValid = (value: string) => {
        try {
            validatePresence(value)
            validateAccountLength(value)
        } catch (errorObject) {
            errorMessage = errorObject.message
            return false
        }

        errorMessage = undefined
        return true
    }
</script>

<InputLabelled
    on:changed
    {name}
    {fluid}
    {focus}
    {inputmode}
    {placeholder}
    bind:value
    {isValid}
    {errorMessage}
/>
