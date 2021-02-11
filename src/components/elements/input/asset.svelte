<script lang="ts">
    import {Asset} from '@greymass/eosio'

    import {activeBlockchain} from '~/store'
    import Input from '~/components/elements/input.svelte'
    import ErrorMessage from './errorMessage.svelte'

    export let symbol: Asset.Symbol = $activeBlockchain.coreTokenSymbol
    export let name: string = ''
    export let value: string = ''
    export let allowZero: boolean = false
    export let availableBalance: number | null

    let errorMessage: string | null

    const validate = async (value: string) => {
        try {
            validatePresence(value)
            validateIsNumber(value)
            validateNonZero(value)
            validateBalance(value)
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

    function validateIsNumber(value: string) {
      const units = unitsFromValue(value)
      const unitsAreNotNumber = isNaN(units)

      if (unitsAreNotNumber) {
        throw {
          valid: false,
          message: 'Should be a number.',
        }
      }
    }

    function validateNonZero(value: string) {
      const units = unitsFromValue(value)
      const isLessThanZero = Asset.fromUnits(units, symbol).value <= 0

      if (isLessThanZero) {
        throw {
            valid: false,
            message: 'Should be greater than zero.',
        }
      }
    }

    function validateBalance(value: string) {
      if (!availableBalance) {
        return true
      }

      const units = unitsFromValue(value)

      if (units > availableBalance.units) {
        throw {
          valid: false,
          message: 'Insufficient funds available.',
        }
      }
    }

    function unitsFromValue(value: string) {
      return Math.floor(parseFloat(value) * Math.pow(10, symbol.precision))
    }
</script>

<style type="scss">
</style>

<Input on:changed {name} bind:value isValid={validate} />

<ErrorMessage {errorMessage} />

