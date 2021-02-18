<script lang="ts">
    import Input from '~/components/elements/input.svelte'
    import ErrorMessage from './errorMessage.svelte'

    export let name: string = ''
    export let value: string = ''
    export let errorMessage: string | undefined = undefined
    export let valid: boolean = false
    export let focus: boolean = false

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

    function validatePresence(value: string) {
        if (value.length === 0) {
            throw {
                valid: false,
                message: undefined,
            }
        }
    }
</script>

<style type="scss">
</style>

<div>
    <Input on:changed {name} {focus} bind:value isValid={validate} />
    <ErrorMessage {errorMessage} />
</div>
