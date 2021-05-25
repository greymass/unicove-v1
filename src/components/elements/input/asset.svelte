<script lang="ts">
    import type {Asset} from '@greymass/eosio'

    import {activeBlockchain} from '~/store'
    import InputLabelled from '~/components/elements/input/labelled.svelte'

    import {validatePresence} from './validators/presence'
    import {validateBalance, validateIsNumber, validateNonZero} from './validators/asset'

    export let symbol: Asset.Symbol = $activeBlockchain!.coreTokenSymbol
    export let name: string = ''
    export let value: string = ''
    export let allowZero: boolean = false
    export let balance: Asset | undefined = undefined
    export let valid: boolean = false
    export let focus: boolean = false
    export let fluid: boolean = false
    export let placeholder: string | undefined = undefined

    let errorMessage: string | undefined

    const isValid = (value: string) => {
        try {
            validatePresence(value)
            validateIsNumber(value, symbol)
            if (!allowZero) {
                validateNonZero(value, symbol)
            }
            if (balance) {
                validateBalance(value, balance)
            }
        } catch (errorObject) {
            errorMessage = errorObject.message
            valid = false
            return false
        }

        errorMessage = undefined
        valid = true
        return true
    }
</script>

<style type="scss">
</style>

<InputLabelled
    bind:value
    on:changed
    {errorMessage}
    {fluid}
    {focus}
    {name}
    {placeholder}
    {isValid}
    inputmode="decimal"
/>
