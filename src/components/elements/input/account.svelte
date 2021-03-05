<script lang="ts">
    import Input from '~/components/elements/input.svelte'
    import ErrorMessage from './errorMessage.svelte'

    export let name: string = ''
    export let value: string = ''
    export let errorMessage: string | undefined = undefined
    export let valid: boolean = false
    export let isValid: ((arg0: string) => boolean | Promise<boolean>) | undefined = undefined
    export let focus: boolean = false
    export let fullWidth: boolean = false
    export let placeholder: string | undefined = undefined

    const validate = async (value: string) => {
        try {
            validatePresence(value)
            validateLength(value)
            isValid && isValid(value)
        } catch (errorObject) {
            errorMessage = errorObject.message
            valid = false
            return false
        }

        errorMessage = undefined
        valid = true
        return true
    }

    function validatePresence(value: string) {
        if (value.length === 0) {
            throw {
                valid: false,
                message: undefined,
            }
        }
    }

    function validateLength(value: string) {
        if (value.length > 13) {
            throw {
                valid: false,
                message: 'Should be 13 characters or less.',
            }
        }
    }
</script>

<div>
    <Input on:changed {name} {fullWidth} {focus} {placeholder} bind:value isValid={validate} />
    <ErrorMessage {errorMessage} />
</div>
