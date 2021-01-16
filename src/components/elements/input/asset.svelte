<script lang="ts">
    import {Asset} from '@greymass/eosio'

    import Input from '~/components/elements/input.svelte'

    export let symbol: Asset.Symbol
    export let name: string = ''
    export let value: string = ''

    const validate = (value: string) => {
        try {
            if (value.length === 0) return false
            const units = Math.floor(parseFloat(value) * Math.pow(10, symbol.precision))
            return Asset.fromUnits(units, symbol).value > 0
        } catch (error) {
            // might be nice to catch errors for form validation errors
            return false
        }
    }
</script>

<style type="scss">
</style>

<Input on:changed {name} bind:value isValid={validate} />
