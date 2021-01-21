<script lang="ts">
    import {Asset} from '@greymass/eosio'

    import {activeBlockchain} from '~/store'
    import Input from '~/components/elements/input.svelte'

    export let symbol: Asset.Symbol = $activeBlockchain.coreTokenSymbol
    export let name: string = ''
    export let value: string = ''
    export let allowZero: boolean = false

    const validate = (value: string) => {
        try {
            // Ensure a value is provided
            if (value.length === 0) return false
            // Ensure the value is a number
            const units = Math.floor(parseFloat(value) * Math.pow(10, symbol.precision))
            if (isNaN(units)) return false
            // Ensure the number is greater than 0
            if (!allowZero) {
                return Asset.fromUnits(units, symbol).value > 0
            }
            // otherwise return true
            return true
        } catch (error) {
            // might be nice to catch errors for form validation errors
            return false
        }
    }
</script>

<style type="scss">
</style>

<Input on:changed {name} bind:value isValid={validate} />
