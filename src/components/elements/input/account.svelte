<script lang="ts">
    import {Name} from '@greymass/eosio'
    import type {LinkSession} from 'anchor-link'


    import Input from '~/components/elements/input.svelte'
    import ErrorMessage from './errorMessage.svelte'

    export let fieldAccountName: string = ''
    export let value: string = ''
    export let errorMessage: string | null
    export let activeSession: LinkSession | null

    const validate = async (value: string) => {
        try {
            validatePresence(value)
            validateLength(value)
            await validateExistence(value)
        } catch (errorObject) {
            errorMessage = errorObject.message
            return false
        }

        errorMessage = null
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

    function validateLength(value: string) {
        if (value.length > 13) {
            throw {
                valid: false,
                message: 'Should be 13 characters or less.',
            }
        }
    }

    async function validateExistence(value: string) {
        return activeSession.client.v1.chain.get_account(value).catch(error => {
          const isUnkownAccountError = error.toString().includes('exception: unknown key')

          if (isUnkownAccountError) {
            throw {
              valid: false,
              message: 'Is not a valid account name.',
            }
          }
        })
    }
</script>

<style type="scss">
</style>

<Input on:changed {name} bind:value isValid={validate} {errorMessage} />

<ErrorMessage {errorMessage} />
