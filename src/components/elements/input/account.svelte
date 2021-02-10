<script lang="ts">
    import {Name} from '@greymass/eosio'

    import AutoComplete from 'simple-svelte-autocomplete'

    import Input from '~/components/elements/input.svelte'

    export let fieldAccountName: string = ''
    export let value: string = ''
    export let errorMessage: string | null
    let searchedString
    let relevantAccountNames

    const handleInput = (value: string) => {
      searchedString = value;

      // do eosio account lookup here..s

      relevantAccountNames = ['teamgreymass', 'dafugatester']
    }

    const selectResult(accountName) {
        fieldAccountName = accountName
    }

    const validate = (value: string) => {
        try {
            validatePresence(value)
            validateLength(value)
            validateIsString(value)
        } catch (errorObject) {
            errorMessage = errorObject.message

            return false
        }

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
                message: 'An account name should be 13 characters or less.',
            }
        }
    }

    function validateIsString(value: string) {
        if (Name.from(value).toString() !== value) {
            throw {
                valid: false,
                message: 'Is not a valid account name.',
            }
        }
    }
</script>

<style type="scss">
</style>

<Input on:changed on:change={handleInput} {fieldAccountName} bind:value isValid={validate} {errorMessage} />
