<script lang="ts">
    import {Name} from '@greymass/eosio'

    import Input from '~/components/elements/input.svelte'

    export let name: string = ''
    export let value: string = ''

    const validate = (value: string) => {
        try {
            if (value.length === 0) return false
            return Name.from(value).toString() === value
        } catch (error) {
            // might be nice to catch errors for form validation errors
            return false
        }
    }
</script>

<style type="scss">
</style>

<Input on:changed {name} bind:value isValid={validate} />
