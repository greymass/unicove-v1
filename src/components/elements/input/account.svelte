<script lang="ts">
    import {Name} from '@greymass/eosio'

    import Input from '~/components/elements/input.svelte'

    export let name: string = ''
    export let value: string = ''
    export let errorMessage: string | null

    const validate = (value: string) => {
        try {
            validatePresence(value)
            validateLength(value)
            validateIsString(value)
        } catch (errorObject) {
            errorMessage =  errorObject.message

            return false;
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
            message: 'An account name should be 13 characters or less.'
          }
       }
    }

    function validateIsString(value: string) {
       if (Name.from(value).toString() !== value) {
         throw {
           valid: false,
           message: 'Is not a valid account name.'
         };
       }
    }
</script>

<style type="scss">
</style>

<Input on:changed {name} bind:value isValid={validate} errorMessage="{errorMessage}" />

