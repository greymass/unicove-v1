<script lang="ts">
    import InputLabelled from '~/components/elements/input/labelled.svelte'

    import {validatePresence} from './validators/presence'

    export let name: string = ''
    export let value: string = ''
    export let errorMessage: string | undefined = undefined
    export let valid: boolean = false
    export let focus: boolean = false
    export let fluid: boolean = false
    export let placeholder: string | undefined = undefined

    const validate = async (value: string) => {
        try {
            validatePresence(value)
        } catch (errorObject) {
            errorMessage = errorObject.message
            valid = false
            return false
        }

        errorMessage = undefined
        valid = true
        return true
    }
</script>

<style type="scss">
</style>

<InputLabelled on:changed {name} {fluid} {focus} {placeholder} bind:value isValid={validate} />
