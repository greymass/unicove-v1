<script lang="ts">
    import {Name} from '@greymass/eosio'
    import type {LinkSession} from 'anchor-link'

    import Input from '~/components/elements/input.svelte'
    import ErrorMessage from './errorMessage.svelte'

    export let name: string = ''
    export let value: string = ''
    export let errorMessage: string | null
    export let valid: boolean = false

    const validate = async (value: string) => {
        try {
            validatePresence(value)
        } catch (errorObject) {
            errorMessage = errorObject.message
            valid = false
            return false
        }

        console.log('validate')
        console.log('valid')

        errorMessage = null
        valid = true
        return true
    }

    function validatePresence(value: string) {
        if (value.length === 0) {
            throw {
                valid: false,
                message: null,
            }
        }
    }
</script>

<style type="scss">
</style>

<div>
    <Input on:changed {name} bind:value isValid={validate} {errorMessage} />
    <ErrorMessage {errorMessage} />
</div>

