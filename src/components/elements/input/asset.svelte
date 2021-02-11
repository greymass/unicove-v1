<script lang="ts">
    import {Asset} from '@greymass/eosio'

    import {activeBlockchain} from '~/store'
    import Input from '~/components/elements/input.svelte'
    import ErrorMessage from './errorMessage.svelte'

    export let symbol: Asset.Symbol = $activeBlockchain.coreTokenSymbol
    export let name: string = ''
    export let value: string = ''
    export let allowZero: boolean = false

    let errorMessage: string | null

    const validate = async (value: string) => {
        try {
            validatePresence(value)
            validateIsNumber(value)
            validateNonZero(value)
        } catch (errorObject) {
            console.log({errorObject})
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

    function validateIsNumber(value: number) {
      console.log({symbol})
      const units = Math.floor(parseFloat(value) * Math.pow(10, symbol.precision))
      console.log({units})
      const unitsAreNotNumber = isNaN(units)
      if (unitsAreNotNumber) {
        throw {
          valid: false,
          message: 'Should be a number.',
        }
      }
    }

    function validateNonZero(value: string) {
      const isLessThanZero = Asset.fromUnits(value, symbol).value <= 0;
      if (isLessThanZero) {
        throw {
            valid: false,
            message: 'Should be greater than zero.',
        }
      }
    }
</script>

<style type="scss">
</style>

<Input on:changed {name} bind:value isValid={validate} />

<ErrorMessage {errorMessage} />

