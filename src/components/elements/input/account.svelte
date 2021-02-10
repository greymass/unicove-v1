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
       console.log('validateLength check')
       if (value.length > 13) {
         console.log('validateLength hit')
         console.log({value})
          throw {
            valid: false,
            message: 'An account name should be 13 characters or less.'
          }
       }
    }

    function validateIsString(value: string) {
       if (Name.from(value).toString() !== value) {
         console.log('in validateIsString')
         console.log(Name.from(value).toString())
         console.log({value})
         throw {
           valid: false,
           message: 'Is not a valid account name.'
         };
       }
    }

    $: {
      console.log('input rendering')
      console.log({errorMessage})
    }
</script>

<style type="scss">
</style>

<Input on:changed {name} bind:value isValid={validate} errorMessage="{errorMessage}" />

